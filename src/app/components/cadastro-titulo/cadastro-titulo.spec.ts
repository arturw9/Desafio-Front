import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CadastroTitulo } from './cadastro-titulo';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('CadastroTitulo', () => {
  let component: CadastroTitulo;
  let fixture: ComponentFixture<CadastroTitulo>;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, CadastroTitulo],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroTitulo);
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

  it('onNumeroTituloInput deve aceitar apenas números', () => {
    const event = { target: { value: 'ABC123!' } };
    component.onNumeroTituloInput(event);
    expect(component.titulo.numeroTitulo).toBe('123');
  });

  it('adicionarParcela deve aumentar a quantidade de parcelas', () => {
    const qtdInicial = component.titulo.parcelas.length;
    component.adicionarParcela();
    expect(component.titulo.parcelas.length).toBe(qtdInicial + 1);
  });

  it('removerParcela deve remover uma parcela se houver mais de uma', () => {
    component.titulo.parcelas.push({ numeroParcela: 2, dataVencimento: '', valorParcela: null });
    const qtdInicial = component.titulo.parcelas.length;
    component.removerParcela(0);
    expect(component.titulo.parcelas.length).toBe(qtdInicial - 1);
  });

  it('salvar não deve enviar se o form for inválido', () => {
    spyOn(window, 'alert'); // evitar abrir alert real
    const form = { invalid: true } as NgForm;
    component.salvar(form);
    expect(window.alert).toHaveBeenCalledWith('Preencha todos os campos obrigatórios corretamente!');
  });

  it('salvar deve chamar http.post se o form for válido', () => {
    spyOn(window, 'alert');
    const form = { invalid: false } as NgForm;

    // Força uma data no passado para não disparar regra de data inválida
    component.titulo.parcelas[0].dataVencimento = '2000-01-01';

    component.salvar(form);

    const req = httpMock.expectOne('http://localhost:5000/Titulo/Inserir');
    expect(req.request.method).toBe('POST');

    req.flush({}); // responde OK
    expect(window.alert).toHaveBeenCalledWith('Título cadastrado com sucesso!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/lista-titulos']);
  });
});
