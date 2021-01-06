import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RepoService {

  constructor(private http: HttpClient) { }

  url: string = environment.badgeurl

  getprojectdetails(user, repository) {
    return this.http.get<any>(this.url + user + '/' + repository);
  }
}
