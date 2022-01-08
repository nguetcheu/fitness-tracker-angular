import { Injectable } from "@angular/core";
import {Router} from "@angular/router";
import { Subject } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import {MatSnackBar} from "@angular/material/snack-bar";

import { AuthData } from './auth-data.model';
import {TrainingService} from "../training/training.service";
import {UiService} from "../shared/ui.service";


@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    // @ts-ignore
    private isAuthenticated = false;


    constructor(private router: Router,
                private afAuth: AngularFireAuth,
                private trainingService : TrainingService,
                private snackBar: MatSnackBar,
                private uiService: UiService
    ) {}

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if(user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            }
            else {
                this.trainingService.cancelSubscription();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        })
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth
        .createUserWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.uiService.loadingStateChanged.next(false);
        })
        .catch(error => {
         this.uiService.loadingStateChanged.next(false);
         if(error.code == 'auth/email-already-in-use'){
                let errorMessage = 'E-mail fourni est déjà utilisé par un utilisateur existant.';
                // @ts-ignore
                this.snackBar.open(errorMessage, null, ()=> {
                    duration:3000
                });
            }
        });
    }

    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth
            .signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.uiService.loadingStateChanged.next(false);
                if(error.code == 'auth/wrong-password') {
                    let errorMessage = 'Le mot de passe est invalide';
                    // @ts-ignore
                    this.snackBar.open(errorMessage, null, ()=> {
                        duration:3000
                    });
                }
                else if(error.code == 'auth/network-request-failed'){
                    let errorMessage = 'Impossible de se connecter au serveur.Verifier votre connexion';
                    // @ts-ignore
                    this.snackBar.open(errorMessage, null, ()=> {
                        duration:3000
                    });
                }
                else {
                    // @ts-ignore
                    this.snackBar.open(error.message, null, () => {
                        duration:3000
                    })
                }
            });
    }

    logout() {
        this.afAuth.auth.signOut();
    }


    isAuth() {
        return this.isAuthenticated;
    }
}
