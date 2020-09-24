import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/Photo';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
    
  @Input() photos: Photo[];
  @Output() getMemberMainPhoto = new EventEmitter<string>();
  private URL : string = environment.baseUrl;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  currentPhoto : Photo;

  constructor(private authService: AuthService, private userService: UserService, private alertifyService: AlertifyService) { }

  ngOnInit() {
      this.initializeFileUpload();
  }

  initializeFileUpload() {
      this.uploader = new FileUploader({ 
        url: this.URL + 'users/' + this.authService.decodeToken.nameid + '/photos',
        authToken: 'Bearer ' + localStorage.getItem('token'),
        isHTML5: true,
        allowedFileType: ['image'],
        maxFileSize : 10 * 1024 * 1024,
        removeAfterUpload: true,
        autoUpload: false
      });
      this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false }

      this.uploader.onSuccessItem = (item, response ) => {
          if(response) {
              const res: Photo = JSON.parse(response);
              // const photo = {
              //     id : res.id,
              //     url: res.url,
              //     description: res.description,
              //     dateAdded: res.dateAdded,
              //     isMain: res.isMain,
                                
              // }
              this.photos.push(res);
              if (res.isMain) {
                  this.getMemberMainPhoto.emit(res.url);            
              }
          }
      }
  }

  public fileOverBase(e:any):void {
      this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
      this.userService.setMainPhoto(this.authService.decodeToken.nameid, photo.id).subscribe(() => {
        this.currentPhoto = this.photos.filter(p => p.isMain === true)[0];
        this.currentPhoto.isMain = false;
        photo.isMain = true;
        this.getMemberMainPhoto.emit(photo.url);
        }, (err) => {
        this.alertifyService.error(err);          
      });
  }

  deletePhoto(id : number) {
      this.alertifyService.confirm("Are you sure want to delete the photo", () => {
          this.userService.deletePhoto(this.authService.decodeToken.nameid, id).subscribe(() => {
              this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
              this.alertifyService.success("Deleted the photo");            
          }, error => {
              this.alertifyService.error("Failed to delete the photo");
          })            
      });
  }

}
