import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router'
import { UserService } from '../../services/user/user.service';
import { ChatService } from '../../services/chat/chat.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { AnnouncementsService } from '../../services/announcements/announcements.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private router: Router,
              private userService: UserService,
              private chatService: ChatService,
              private dialogService: DialogService,
              private viewContainerRef: ViewContainerRef,
              private announcementService: AnnouncementsService) { }

  ngOnInit() {
    if (!this.userService.isUserLoggedIn()) {
      this.router.navigateByUrl('login');
    }

    this.chatService.receivePrivateMessage()
      .filter(message => message.receiver.userId === this.userService.userId)
      .filter(message => this.router.url !== `/chat/${message.sender.userId}`)
      .subscribe(message => {
        this.dialogService.openDialogue(this.viewContainerRef,
          'New Message',
          `${message.sender.username} sent you a message. Would you like to see it?`)
          .filter(result => result === true)
          .subscribe(() => this.router.navigateByUrl(`chat/${message.sender.userId}`))
      });

    this.announcementService.listenToAnnouncementEvent()
          .filter(announcement => this.router.url !== `/announcements`)
          .subscribe(  announcement => {
            this.dialogService.openDialogue(this.viewContainerRef,
              `${announcement.content}`,
              `Would you like more details?`)
              .filter(result => result === true)
              .subscribe(() => this.router.navigateByUrl(`announcements`))
          }  );


    this.chatService.listenToAccountInactiveEvent().filter( val => true ).subscribe(() => {
      console.log("got notified by account inactivated event!");
      this.userService.logout()
        .subscribe(() => {
          this.dialogService.openAlert(this.viewContainerRef, 'Account Deactivated', 'Your account has been deactivated by the administrator. You will be automatically signed out of the system.').subscribe();
          this.router.navigateByUrl('login');
        });
    });

  }

  logoutButtonClicked = (sidenav: any) => {
    sidenav.close();
    this.userService.logout()
      .subscribe(() => {
        this.router.navigateByUrl('login');
      });
  }

}
