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
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private userSvc: UserService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.userSvc.getById(id).subscribe({
        next: (u) => {
          this.user = (u as any).result ?? u;
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el usuario';
          this.loading = false;
        }
      });
    }
  }
}
