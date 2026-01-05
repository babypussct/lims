
import { Injectable, inject } from '@angular/core';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Sop } from '../models/sop.model';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class SopService {
  private firebaseService = inject(FirebaseService);

  async saveSop(sop: Sop): Promise<void> {
    const path = `artifacts/${this.firebaseService.APP_ID}/sops/${sop.id}`;
    await setDoc(doc(this.firebaseService.db, path), sop);
  }

  async deleteSop(id: string): Promise<void> {
    const path = `artifacts/${this.firebaseService.APP_ID}/sops/${id}`;
    await deleteDoc(doc(this.firebaseService.db, path));
  }
}
