import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { env } from '../../../env/env';
import { Titulo } from '../../model/titulo';

@Component({
  selector: 'app-cadastro-titulo',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './cadastro-titulo.html',
  styleUrls: ['./cadastro-titulo.scss']
})
export class CadastroTitulo {
  private http = inject(HttpClient);

  titulo: Titulo = {
    numeroTitulo: '',
    nomeDevedor: '',
    cpfDevedor: '',
    percentualJuros: 0,
    percentualMulta: 0,
    parcelas: [
      {
        numeroParcela: 1,
        dataVencimento: '',
        valorParcela: 0
      }
    ]
  };

  constructor(private router: Router) { }

  numeroTituloStr: string = '';

  get numeroTitulo(): number | null {
    const n = Number(this.numeroTituloStr);
    return isNaN(n) ? null : n;
  }

  salvar(form: NgForm) {
    if (form.invalid) {
      alert('Preencha todos os campos obrigatórios corretamente!');
      return;
    }

    if (this.titulo.percentualJuros <= 0 || this.titulo.percentualMulta <= 0) {
      alert(`Percentual de juros e multa, devem ser maios que zero.`);
      return;
    }

    const hoje = new Date();
    for (let p of this.titulo.parcelas) {
      const dataVenc = new Date(p.dataVencimento);
      if (dataVenc >= hoje) {
        alert(`A data de vencimento da parcela ${p.numeroParcela} deve ser anterior à data atual.`);
        return;
      }
    }

    const tituloParaEnvio = {
      ...this.titulo,
      parcelas: this.titulo.parcelas.map(p => ({
        ...p,
        dataVencimento: new Date(p.dataVencimento).toISOString()
      }))
    };

    this.http.post(`${env.apiUrl}/Titulo/Inserir`, tituloParaEnvio)
      .subscribe({
        next: () => {
          alert('Título cadastrado com sucesso!');
          this.router.navigate(['/lista-titulos']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar título', err);
          alert('Erro ao cadastrar título. Veja o console.');
        }
      });
  }

  voltar() {
    this.router.navigate(['/lista-titulos']);
  }

  adicionarParcela() {
    this.titulo.parcelas.push({ numeroParcela: this.titulo.parcelas.length + 1, dataVencimento: '', valorParcela: 0 });
  }

  removerParcela(index: number) {
    if (this.titulo.parcelas.length > 1) {
      this.titulo.parcelas.splice(index, 1);
    } else {
      alert('Deve haver pelo menos uma parcela.');
    }
  }

  onNumeroTituloInput(event: any) {
    this.titulo.numeroTitulo = event.target.value.replace(/\D/g, '');
  }

}
