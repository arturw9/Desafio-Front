import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cadastro-titulo',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './cadastro-titulo.html',
  styleUrls: ['./cadastro-titulo.scss']
})
export class CadastroTitulo {
  private http = inject(HttpClient);

  titulo = {
    numeroTitulo: '',
    nomeDevedor: '',
    cpfDevedor: '',
    percentualJuros: null as number | null,
    percentualMulta: null as number | null,
    parcelas: [
      { numeroParcela: 1, dataVencimento: '', valorParcela: null as number | null }
    ]
  };

  constructor(private router: Router) {}

  // Propriedade string para bind no input
numeroTituloStr: string = '';

// Getter para obter como número
get numeroTitulo(): number | null {
  const n = Number(this.numeroTituloStr);
  return isNaN(n) ? null : n;
}

  salvar(form: NgForm) {
    if (form.invalid) {
      alert('Preencha todos os campos obrigatórios corretamente!');
      console.log('Form inválido:', form);
      return;
    }

    // Verifica datas das parcelas
    const hoje = new Date();
    for (let p of this.titulo.parcelas) {
      const dataVenc = new Date(p.dataVencimento);
      if (dataVenc >= hoje) {
        alert(`A data de vencimento da parcela ${p.numeroParcela} deve ser anterior à data atual.`);
        return;
      }
    }

    // Converter datas para ISO
    const tituloParaEnvio = {
      ...this.titulo,
      parcelas: this.titulo.parcelas.map(p => ({
        ...p,
        dataVencimento: new Date(p.dataVencimento).toISOString()
      }))
    };

    console.log('Objeto a ser enviado:', tituloParaEnvio);

    this.http.post('http://localhost:5000/Titulo/Inserir', tituloParaEnvio)
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
  this.titulo.parcelas.push({ numeroParcela: this.titulo.parcelas.length + 1, dataVencimento: '', valorParcela: null });
}

removerParcela(index: number) {
  if (this.titulo.parcelas.length > 1) {
    this.titulo.parcelas.splice(index, 1);
  } else {
    alert('Deve haver pelo menos uma parcela.');
  }
}

onNumeroTituloInput(event: any) {
  // Garante apenas dígitos
  this.titulo.numeroTitulo = event.target.value.replace(/\D/g, '');
}

}
