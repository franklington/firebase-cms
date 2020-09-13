import { Component, OnInit } from '@angular/core';
import {EventEmitter, Input, Output } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import {AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';







@Component({
  selector: 'seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.scss']
})

export class SeatSelectionComponent implements OnInit {
  @Input() productKey:string;
  //@Input() venue: string;
  @Output() selectedSeat = new EventEmitter<any>();
  @ViewChild('SeatingLayout', { static: true }) seatingLayout: ElementRef;

  // Some Vars
  user: Observable<firebase.User>;
  seats: AngularFireList<any>;
  userObject: any;
  seatsToSelect;


  //here some code for reporting selected seats back


  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,

  ) {
    this.seatsToSelect = 2;
    let userOrders;
    this.user = afAuth.authState;
    this.user.subscribe(currentUser => {
      if (currentUser && currentUser.uid) {
        this.userObject = currentUser;
      }
    });
  }
  ngOnInit(): void {
    this.seats = this.db.list('/seats', ref => ref.orderByChild('product').equalTo(this.productKey));


  }



  ngAfterViewInit(): void {



    //watch the seatsreservation changes
      this.seats.valueChanges().subscribe(items => {
        let svgSeats = this.seatingLayout.nativeElement.children;
        let allSeats = this.seatingLayout.nativeElement.getElementsByClassName("reserved");

        for(var i = 0; i<allSeats.length; i++){
          console.log("remove all reserved");
          allSeats[i].classList.remove("reserved");
        }

        for(var i = 0; i<items.length; i++){
          console.log("ID OF CLICKED ELEMENT"+ items[i].id);
          if(items[i].id){
            svgSeats.namedItem(items[i].id).classList.add("reserved");
            if(items[i].userKey == this.userObject.uid){
                svgSeats.namedItem(items[i].id).classList.add("currentUser");
            }
          }
          }

        });


  }
  //Select a seat
  selectSeat(e:HTMLElement): void{
      if(e.classList.contains("seat") && !e.classList.contains("covid") &&  !e.classList.contains("reserved")){
        let selectedSeat = {
          id: e.getAttribute("id"),
          section: e.getAttribute("section"),
          row:  e.getAttribute("row"),
          seat: e.getAttribute("seat"),
          userKey: this.userObject.uid,

        };

        this.seats.push(selectedSeat).then((item) => {

          if (this.productKey) {

            this.db.list('/products/' +this.productKey + '/seats').push(item.key).set(Date.now().toString());
            this.db.object('/seats/' + item.key + '/product/').set(this.productKey);
          }

        });
        this.selectedSeat.emit(selectedSeat);


        //e.classList.add("reserved");
      //  console.log(selectedSeat);
      }
      if(e.classList.contains("seat") && e.classList.contains("reserved") &&  e.classList.contains("currentUser")){
        e.classList.remove("reserved");
      }
  }

}
