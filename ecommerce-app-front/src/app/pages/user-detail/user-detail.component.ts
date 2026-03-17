import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user?: User;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private userSvc: UserService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.userSvc.getById(id).subscribe({
        next: (u) => {
          let user: any = u;
          if (user && typeof user === 'object') {
            if ('message' in user && user.message && typeof user.message === 'object' && 'result' in user.message) {
              user = user.message.result;
            } else if ('result' in user) {
              user = user.result;
            }
          }
          this.user = user;
          this.loading = false;
          console.log('Usuario cargado:', this.user);
        },
        error: () => {
          this.error = 'No se pudo cargar el usuario';
          this.loading = false;
        }
      });
    }
  }
}
