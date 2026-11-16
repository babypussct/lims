import { ANGULAR_SOP_CONFIG } from './config/sop-configs';
import {
  buildPublishPreflightSummary,
  PublishPreflightArgs,
  PublishPreflightSummary,
} from './result-preflight';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';

export type PreflightTargetKind =
  | 'date_analyst'
  | 'date_reviewer'
  | 'r2'
  | 'sample_selection'
  | 'incomplete_sample';

export interface PreflightActionItem {
  id: string;
  severity: 'blocker' | 'warning' | 'info';
  message: string;
  actionLabel?: string;
  targetKind?: PreflightTargetKind;
  sampleCode?: string;
}

export interface LivePreflightState {
  summary: PublishPreflightSummary;
  isReady: boolean;
  blockerCount: number;
  warningCount: number;
  items: PreflightActionItem[];
}

export function resolvePublishPreflightConfig(
  configKey: string | null | undefined,
  draft: AnalysisResultDraft | null | undefined,
  fallbackConfig: any
): any {
  const isSop914ShortForm = configKey === 'tbvtv-thuc-pham-gcmsms'
    && draft?.page1Data?.['printFormType'] === 'formRutGon';
  return isSop914ShortForm
    ? ANGULAR_SOP_CONFIG['tbvtv-thuc-pham-gcmsms-rut-gon']
    : fallbackConfig;
}

function extractFirstSampleCode(message: string): string | undefined {
  const colonIdx = message.lastIndexOf(':');
  if (colonIdx === -1) return undefined;
  const tail = message.slice(colonIdx + 1).replace(/\.\.\.$/, '').trim();
  const first = tail.split(',')[0]?.trim();
  return first || undefined;
}

function classifyBlocker(message: string, idx: number): PreflightActionItem {
  if (message.includes('Người phân tích')) {
    return {
      id: `blocker_${idx}_analyst_date`,
      severity: 'blocker',
      message,
      actionLabel: 'Đi tới',
      targetKind: 'date_analyst',
    };
  }
  if (message.includes('Người thẩm tra')) {
    return {
      id: `blocker_${idx}_reviewer_date`,
      severity: 'blocker',
      message,
      actionLabel: 'Đi tới',
      targetKind: 'date_reviewer',
    };
  }
  if (message.includes('Chưa có mẫu nào được chọn')) {
    return {
      id: `blocker_${idx}_sample_selection`,
      severity: 'blocker',
      message,
      actionLabel: 'Chọn mẫu',
      targetKind: 'sample_selection',
    };
  }
  if (message.includes('chưa có kết quả') || message.includes('không hợp lệ')) {
    const sampleCode = extractFirstSampleCode(message);
    return {
      id: `blocker_${idx}_incomplete_sample`,
      severity: 'blocker',
      message,
      actionLabel: sampleCode ? `Mở ${sampleCode}` : 'Đi tới',
      targetKind: 'incomplete_sample',
      sampleCode,
    };
  }
  return {
    id: `blocker_${idx}`,
    severity: 'blocker',
    message,
  };
}

function classifyWarning(message: string, idx: number): PreflightActionItem {
  if (message.includes('R²')) {
    return {
      id: `warning_${idx}_r2`,
      severity: 'warning',
      message,
      actionLabel: 'Đi tới',
      targetKind: 'r2',
    };
  }
  return {
    id: `warning_${idx}`,
    severity: 'warning',
    message,
  };
}

/**
 * Live header preflight state built over `buildPublishPreflightSummary` with the
 * exact config resolution used at publish time (including SOP 9.14 short form).
 */
export function buildLivePreflightState(args: PublishPreflightArgs): LivePreflightState {
  const effectiveConfig = resolvePublishPreflightConfig(args.configKey, args.draft, args.config);
  const summary = buildPublishPreflightSummary({
    ...args,
    config: effectiveConfig,
  });

  const items: PreflightActionItem[] = [
    ...summary.blockers.map((msg, idx) => classifyBlocker(msg, idx)),
    ...summary.warnings.map((msg, idx) => classifyWarning(msg, idx)),
    ...summary.info.map((msg, idx) => ({
      id: `info_${idx}`,
      severity: 'info' as const,
      message: msg,
    })),
  ];

  return {
    summary,
    isReady: summary.blockers.length === 0,
    blockerCount: summary.blockers.length,
    warningCount: summary.warnings.length,
    items,
  };
}
