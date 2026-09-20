import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

type Action = 'status' | 'grant' | 'revoke';

const readArg = (prefix: string): string | undefined =>
  process.argv.slice(2).find(arg => arg.startsWith(prefix))?.slice(prefix.length).trim() || undefined;

const hasFlag = (flag: string): boolean => process.argv.slice(2).includes(flag);

function resolveAction(): Action {
  const actions = (['status', 'grant', 'revoke'] as const).filter(action => hasFlag(`--${action}`));
  if (actions.length > 1) throw new Error('Chỉ được chọn một thao tác: --status, --grant hoặc --revoke.');
  return actions[0] ?? 'status';
}

function confirmation(action: Exclude<Action, 'status'>, projectId: string, appId: string, uid: string): string {
  return `${action.toUpperCase()}:${projectId}:${appId}:${uid}`;
}

async function main(): Promise<void> {
  if (hasFlag('--help')) {
    console.log('Superadmin = role=manager + protectedAdmin=true');
    console.log('Status: npm run admin:superadmin -- --status --project-id=<id> [--app-id=<id>] [--uid=<uid>]');
    console.log('Grant:  npm run admin:superadmin -- --grant --project-id=<id> --app-id=<id> --uid=<uid> --confirm=GRANT:<project>:<app>:<uid>');
    console.log('Revoke: npm run admin:superadmin -- --revoke --project-id=<id> --app-id=<id> --uid=<uid> --confirm=REVOKE:<project>:<app>:<uid>');
    return;
  }

  const action = resolveAction();
  const uid = readArg('--uid=');
  const appId = readArg('--app-id=') || process.env['LIMS_APP_ID'] || 'lims-cloud-fixed';
  const projectId = readArg('--project-id=') || process.env['FIREBASE_PROJECT_ID'] || process.env['GCLOUD_PROJECT'];

  if (!projectId) {
    throw new Error('Thiếu project id. Dùng --project-id=<id> hoặc FIREBASE_PROJECT_ID/GCLOUD_PROJECT.');
  }
  if ((action === 'grant' || action === 'revoke') && !uid) {
    throw new Error(`Thao tác --${action} bắt buộc --uid=<firebase-auth-uid>.`);
  }

  if (action !== 'status') {
    const expectedConfirmation = confirmation(action, projectId, appId, uid!);
    if (readArg('--confirm=') !== expectedConfirmation) {
      throw new Error(`Xác nhận chưa đúng. Chạy lại với --confirm=${expectedConfirmation}`);
    }
  }

  const app = getApps()[0] ?? initializeApp({ credential: applicationDefault(), projectId });
  const db = getFirestore(app);
  const users = db.collection(`artifacts/${appId}/users`);

  if (action === 'status') {
    if (uid) {
      const snapshot = await users.doc(uid).get();
      if (!snapshot.exists) throw new Error(`Không tìm thấy profile ${uid}.`);
      const data = snapshot.data() || {};
      console.table([{
        uid: snapshot.id,
        email: data['email'] || '',
        displayName: data['displayName'] || '',
        role: data['role'] || 'pending',
        protectedAdmin: data['protectedAdmin'] === true,
        validSuperadmin: data['role'] === 'manager' && data['protectedAdmin'] === true,
      }]);
      return;
    }

    const snapshot = await users.where('protectedAdmin', '==', true).get();
    console.table(snapshot.docs.map(document => {
      const data = document.data();
      return {
        uid: document.id,
        email: data['email'] || '',
        displayName: data['displayName'] || '',
        role: data['role'] || 'pending',
        validSuperadmin: data['role'] === 'manager',
      };
    }));
    return;
  }

  const targetUid = uid!;
  await getAuth(app).getUser(targetUid);
  const targetRef = users.doc(targetUid);

  await db.runTransaction(async transaction => {
    const targetSnapshot = await transaction.get(targetRef);
    if (!targetSnapshot.exists) throw new Error(`Không tìm thấy profile ${targetUid}.`);
    const target = targetSnapshot.data() || {};

    if (action === 'grant') {
      if (target['role'] === 'manager' && target['protectedAdmin'] === true) return;
      transaction.update(targetRef, {
        role: 'manager',
        roleId: '',
        permissions: [],
        customPermissions: [],
        protectedAdmin: true,
      });
      return;
    }

    if (target['protectedAdmin'] !== true) return;

    if (target['role'] === 'manager') {
      const protectedSnapshot = await transaction.get(users.where('protectedAdmin', '==', true));
      const otherValidSuperadmins = protectedSnapshot.docs.filter(document => {
        const data = document.data();
        return document.id !== targetUid && data['role'] === 'manager' && data['protectedAdmin'] === true;
      });
      if (otherValidSuperadmins.length === 0) {
        throw new Error('Không thể thu hồi Superadmin hợp lệ cuối cùng. Hãy cấp Superadmin khác trước.');
      }
    }

    transaction.update(targetRef, { protectedAdmin: false });
  });

  console.log(action === 'grant'
    ? `Đã chuẩn hóa ${targetUid} thành Superadmin (manager + protectedAdmin).`
    : `Đã thu hồi protectedAdmin của ${targetUid}; vai trò Manager hiện tại được giữ nguyên.`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
