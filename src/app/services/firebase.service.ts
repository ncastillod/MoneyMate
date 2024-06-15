import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

import { Gasto } from '../models/gastos.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  

  private gastosCollection = this.firestore.collection<Gasto>('gastos');
  



  //=========== Agregar Gasto ==============
  
  agregarGasto(gasto: Gasto): Promise<void> {
    const id = this.firestore.createId();
    return this.gastosCollection.doc(id).set({ ...gasto, id });
  }

  //============ Obtener Gastos ============
  obtenerGastos(): Observable<Gasto[]> {
    return this.gastosCollection.valueChanges({ idField: 'id' });
  }


  //================== Autenticación ===================

  getAuth() {
    return getAuth();
  }


  //========== Acceder ===========
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //========== Registrar ===========
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //========== Actualizar ===========
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  //========== Email restablecer contraseña ===========
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }


  //========== Cerrar sesion ===========
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }


  //===================== BASE DE DATOS ======================

  //===== Setear un documento ==========

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }


  //===== Recibir un documento ==========

  async getDocument(path: string) {
    return (await getDoc (doc(getFirestore(), path))).data();
  }


  //===== Añadir un documento ==========
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }




  //========================== Almacenamiento ==================

  

}