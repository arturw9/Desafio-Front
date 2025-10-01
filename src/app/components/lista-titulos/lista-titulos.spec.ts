import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ListaTitulos } from './lista-titulos';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TituloService, Titulo } from '../../services/titulo.service';

describe('ListaTitulos', () => {
  let component: ListaTitulos;
  let fixture: ComponentFixture<ListaTitulos>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ListaTitulos],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: TituloService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaTitulos);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit deve chamar pesquisar e carregar títulos', () => {
    const mockTitulos: Titulo[] = [
      {
        numeroTitulo: '123',
        nomeDevedor: 'João',
        cpfDevedor: '12345678900',
        percentualJuros: 2,
        percentualMulta: 10,
        parcelas: [
          { numeroParcela: 1, dataVencimento: '2020-01-01', valorParcela: 100 }
        ]
      }
    ];

    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost:5000/Titulo/Listar');
    expect(req.request.method).toBe('GET');
    req.flush(mockTitulos);

    expect(component.titulos.length).toBe(1);
    expect(component.titulos[0].nomeDevedor).toBe('João');
  });

  it('pesquisar deve chamar API com filtro quando filtroNome está preenchido', () => {
    component.filtroNome = 'Maria';
    component.pesquisar();

    const req = httpMock.expectOne('http://localhost:5000/Titulo/Listar?nomeDevedor=Maria');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('irParaCadastro deve navegar para cadastro-titulo', () => {
    component.irParaCadastro();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/cadastro-titulo']);
  });

  it('diasAtraso deve retornar 0 para data futura', () => {
    const futura = new Date();
    futura.setDate(futura.getDate() + 5);
    const dias = component.diasAtraso(futura.toISOString());
    expect(dias).toBe(0);
  });

  it('diasAtraso deve calcular dias corretos para data passada', () => {
    const passada = new Date();
    passada.setDate(passada.getDate() - 10);
    const dias = component.diasAtraso(passada.toISOString());
    expect(dias).toBeGreaterThanOrEqual(10);
  });

  it('valorMulta deve calcular corretamente', () => {
    const valor = component.valorMulta(1000, 10);
    expect(valor).toBe(100);
  });

  it('valorJurosParcela deve calcular corretamente', () => {
    const juros = component.valorJurosParcela(100, 30, 3); // 3% ao mês em 30 dias
    expect(juros).toBeCloseTo(3, 1);
  });

  it('valorOriginal deve somar parcelas', () => {
    const titulo: Titulo = {
      numeroTitulo: '1',
      nomeDevedor: 'Teste',
      cpfDevedor: '000',
      percentualJuros: 2,
      percentualMulta: 5,
      parcelas: [
        { numeroParcela: 1, dataVencimento: '2020-01-01', valorParcela: 50 },
        { numeroParcela: 2, dataVencimento: '2020-02-01', valorParcela: 100 }
      ]
    };
    expect(component.valorOriginal(titulo)).toBe(150);
  });

  it('totalDiasAtraso deve pegar o maior atraso entre as parcelas', () => {
    const hoje = new Date();
    const titulo: Titulo = {
      numeroTitulo: '2',
      nomeDevedor: 'Atrasado',
      cpfDevedor: '111',
      percentualJuros: 2,
      percentualMulta: 5,
      parcelas: [
        { numeroParcela: 1, dataVencimento: new Date(hoje.getTime() - 5 * 86400000).toISOString(), valorParcela: 100 },
        { numeroParcela: 2, dataVencimento: new Date(hoje.getTime() - 15 * 86400000).toISOString(), valorParcela: 200 }
      ]
    };
    const dias = component.totalDiasAtraso(titulo);
    expect(dias).toBeGreaterThanOrEqual(15);
  });

  it('valorAtualizado deve somar original + multa + juros', () => {
    const hoje = new Date();
    const titulo: Titulo = {
      numeroTitulo: '3',
      nomeDevedor: 'Calculo',
      cpfDevedor: '222',
      percentualJuros: 3,
      percentualMulta: 10,
      parcelas: [
        { numeroParcela: 1, dataVencimento: new Date(hoje.getTime() - 30 * 86400000).toISOString(), valorParcela: 100 }
      ]
    };
    const valor = component.valorAtualizado(titulo);
    expect(valor).toBeGreaterThan(100); // Deve ser maior que original
  });
});
