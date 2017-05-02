import { Component } from '@angular/core';
import { AlertController, Platform, ModalController, ViewController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { PictureService } from '../../services/picture';
import { MessageType } from '../../../../imports/models';
import { NewLocationMessageComponent } from './location-message';
import template from './messages-attachments.html';

@Component({
  template
})
export class MessagesAttachmentsComponent {
  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private viewCtrl: ViewController,
    private modelCtrl: ModalController,
    private pictureService: PictureService
  ) {}
  
  sendPicture(): void {
    this.pictureService.select().then((file: File) => {
      this.viewCtrl.dismiss({
        messageType: MessageType.PICTURE,
        selectedPicture: file
      });
    });
  }
  
  takePicture(): void {
    if (!this.platform.is('cordova')) {
      return console.warn('Device must run cordova in order to take pictures');
    }

    Camera.getPicture().then((dataURI) => {
      const blob = this.pictureService.convertDataURIToBlob(dataURI);

      this.viewCtrl.dismiss({
        messageType: MessageType.PICTURE,
        selectedPicture: blob
      });
    });
  }
  
  sendLocation(): void {
    const locationModal = this.modelCtrl.create(NewLocationMessageComponent);
    locationModal.onDidDismiss((location) => {
      if (!location) {
        this.viewCtrl.dismiss();

        return;
      }

      this.viewCtrl.dismiss({
        messageType: MessageType.LOCATION,
        selectedLocation: location
      });
    });

    locationModal.present();
  }
}