import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import PouchDB from 'pouchdb-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private db: PouchDB.Database;
  private apiUrl = 'http://test-demo.aemenersol.com/api';

  constructor(
    private http: HttpClient
  ) {
    this.db = new PouchDB('user_credentials');
    this.initializeCredentials();
  }


  private initializeCredentials(): void {
    // predefined credentials based on previous test
    const predefinedCredentials = {
      _id: 'credentials',
      email: 'user@aemenersol.com',
      password: 'Test@123'
    };

    this.db.get('credentials')
      .then((doc: any) => {
        console.log('credentials already exist');
      })
      .catch((err: { status: number; }) => {
        if (err.status === 404) {
          this.db.put(predefinedCredentials)
            .then((response: any) => console.log('predefined credentials stored:', response))
            .catch((error: any) => console.error('error storing predefined credentials:', error));
        } else {
          console.error('error retrieving credentials:', err);
        }
      });
  }

  login(username: string, password: string): Observable<any> {
    const data = { username, password };
    return this.http.post<any>(`${this.apiUrl}/account/login`, data);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  validatePouchDb(email: string, password: string): Promise<boolean> {
    return this.db.get('credentials')
      .then((doc: any) => {
        if (doc.email === email && doc.password === password) {
          console.log('Credentials are validated through PouchDB and success', doc);
          return true;
        } else {
          console.log('Credentials are validated through PouchDB and not success', doc);
          throw new Error('Invalid credentials');
        }
      })
      .catch((error: any) => {
        console.error('Error retrieving credentials from PouchDB:', error);
        throw error;
      });
  }
}


