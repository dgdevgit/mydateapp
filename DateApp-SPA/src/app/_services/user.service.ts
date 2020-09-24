import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';
import { Messages } from '../_models/messages';

@Injectable({
  providedIn: 'root'
})
export class UserService {

baseUrl = environment.baseUrl + 'users/';
constructor(private httpClient: HttpClient) { }

  getUsers(pageNumber?, pageSize?, likeParams?): Observable<PaginatedResult<User[]>>
  {
      const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
      let params = new HttpParams();
      if (pageNumber != null && pageSize != null) {
            params = params.append('pageNumber', pageNumber);
            params = params.append('pageSize', pageSize);
      }
      
      if (likeParams === 'Liker') {
          params = params.append('liker', 'true');
      }
      if (likeParams === 'Likee') {
          params = params.append('likee', 'true');
      }
      
      return this.httpClient.get<User[]>(environment.baseUrl + 'users', { observe: 'response', params: params })
          .pipe(
              map((response) => {
                  paginatedResult.result = response.body;
                  if(response.headers.get('Pagination') != null) {
                      paginatedResult.pageResult = JSON.parse(response.headers.get('Pagination'));
                  }
                  return paginatedResult;
              }) 
              )
  };

  getUser(id: number): Observable<User>{
      return this.httpClient.get<User>(this.baseUrl + id);
  };

  updateUserDetails(id: number, userUpdate: User) {
      return this.httpClient.put(this.baseUrl + id, userUpdate);
  }

  setMainPhoto(userid: number, photoid: number) {
      return this.httpClient.post(this.baseUrl + userid + "/photos/" + photoid + "/setMain", {});
  }

  deletePhoto(userid: number, photoid: number) {
      return this.httpClient.delete(this.baseUrl + userid + "/photos/" + photoid);
  }

  sendLike(userid: number, recipientId: number) {
      return this.httpClient.post(this.baseUrl + userid + "/like/" + recipientId, {});
  }

  getMessages(userid: number, pageNumber?, pageSize?, messageContainer?) {
        
        let params = new HttpParams();
        if (pageNumber != null && pageSize != null) {
            params = params.append('pageNumber', pageNumber);
            params = params.append('pageSize', pageSize);
        }
        params = params.append('messageContainer', messageContainer);
        const paginatedResult = new PaginatedResult<Messages[]>();
        return this.httpClient.get<Messages[]>(this.baseUrl + userid + '/messages', {observe : 'response', params})
            .pipe(
                map((response) => {
                    paginatedResult.result = response.body;
                    if(response.headers.get('Pagination') != null) {
                        paginatedResult.pageResult = JSON.parse(response.headers.get('Pagination'));
                    }
                    return paginatedResult;
                })
            )
  };

  getMessageThread(userid: number, recipientId: number) {
      return this.httpClient.get<Messages[]>(this.baseUrl + userid + '/messages/thread/' + recipientId,)
  }

  sendMessage(userid: number, msg: Messages) {
      return this.httpClient.post(this.baseUrl + userid + '/messages/', msg);
  }

  deleteMessage(id: number, userid: number) {
      return this.httpClient.post(this.baseUrl + userid + '/messages/' + id, {});
  }

  markAsRead(id: number, userid: number) {
      return this.httpClient.post(this.baseUrl + userid + '/messages/' + id + '/read', {}).subscribe();
  }
}
