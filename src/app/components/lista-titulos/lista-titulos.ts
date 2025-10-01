import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TituloService, Titulo } from '../../services/titulo.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-titulos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-titulos.html',
  styleUrls: ['./lista-titulos.scss']
})
export class ListaTitulos implements OnInit {
    private http = inject(HttpClient);
  titulos: Titulo[] = [];
  filtroNome: string = '';

  hoje = new Date('2020-09-21');

  constructor(private tituloService: TituloService, private router: Router) {}

  ngOnInit() {
    this.pesquisar(); // carrega todos inicialmente
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro-titulo']);
  }

  pesquisar() {
    let url = 'http://localhost:5000/Titulo/Listar';
    if (this.filtroNome && this.filtroNome.trim() !== '') {
      url += `?nomeDevedor=${this.filtroNome}`;
    }

    this.http.get<Titulo[]>(url).subscribe({
      next: data => this.titulos = data,
      error: err => console.error('Erro ao carregar títulos', err)
    });
  }

  diasAtraso(dataVencimento: string): number {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);

    const diff = hoje.getTime() - vencimento.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    return dias > 0 ? dias : 0;
}

  valorMulta(valor: number, percentual: number): number {
    return (valor * percentual) / 100;
  }

  valorJurosParcela(parcela: number, diasAtraso: number, percentualJuros: number): number {
    return ((percentualJuros / 30) * diasAtraso * parcela) / 100;
  }

  valorOriginal(titulo: Titulo): number {
    return titulo.parcelas.reduce((sum, p) => sum + p.valorParcela, 0);
  }

  totalDiasAtraso(titulo: Titulo): number {
  return Math.max(...titulo.parcelas.map(p => this.diasAtraso(p.dataVencimento)));
} // Total de dias em atraso esta pegando somente o maior, conforme o desafio

  valorAtualizado(titulo: Titulo): number {
    const valorOriginal = this.valorOriginal(titulo);
    const multa = this.valorMulta(valorOriginal, titulo.percentualMulta);
    let jurosTotal = 0;
    titulo.parcelas.forEach(p => {
      const dias = this.diasAtraso(p.dataVencimento);
      jurosTotal += this.valorJurosParcela(p.valorParcela, dias, titulo.percentualJuros);
    });
    return valorOriginal + multa + jurosTotal;
  }
}
