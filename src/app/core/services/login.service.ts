import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/model/User';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http:HttpClient,
    private router:Router,
    private localStorageSv:LocalStorageService

  ){
    this.user$ = this.observableUser;

    // console.log("UserData: ")
    this.user$.subscribe(data => console.log(data))
    console.log("LoginStatus: ")
    this.observableLogin.subscribe(data => console.log(data))


    if(this.localStorageSv.getLogin){
      this.redirect();
    }
  }



  // ------------------------------ Variables ----------------------------------
  userEx:User=this.localStorageSv.userEx;

  user$:Observable<User>;
  
  // user!: User;
  // seguramente estos campos salgan de la DDBB
  // name:string = "";
  // lastName:string = "";

  
  // --------------------------------- Url -------------------------------------
  private urlUser = 'http://localhost:8080/user';
  private urlWorkspace = '/home/base';


  // ----------------------- Observable LoginStatus ---------------------------
  private observableLoginPrivate:BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  get observableLogin(){return this.observableLoginPrivate.asObservable()};

  set observableLoginBool(bool:boolean){this.observableLoginPrivate.next(bool)};

  // ------------------------- Observable User ---------------------------------
  private observableUserPrivate:BehaviorSubject<User> =
    new BehaviorSubject<User>(this.userEx);
  
  get observableUser(){return this.observableUserPrivate.asObservable()};

  set observableUserData(user:User){this.observableUserPrivate.next(user)};
  // ---------------------------------------------------------------------------


  // ------------------------------ redirect -----------------------------------
  redirect(){
    if(this.observableLogin){
      this.router.navigate([this.urlWorkspace]);
    }
  }
  
  
  
  // ------------------------------ log in/up ----------------------------------
  register(usr:User){
    this.http.post(this.urlUser + '/set', usr).subscribe(
      (data) => {return data}
    );
  };

  login(email:string, password:string){
    this.http.get(this.urlUser + '/login/' + email + '/' + password).subscribe(data => {
      if(data == null){
        console.error("error!");
      } else {
        this.observableUserData = data as User;
        this.observableLoginBool = true;

        this.localStorageSv.setUser = data as User;
        this.localStorageSv.setLogin = true;

        this.redirect();
      }
    })
  };
  

}
