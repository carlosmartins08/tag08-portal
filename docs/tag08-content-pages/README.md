# TAG08 Content Pages Package

## Objetivo

Este pacote contém os arquivos base de conteúdo das páginas institucionais principais do novo site TAG08.

A lógica adotada é simples:

- cada rota tem um arquivo próprio;
- cada arquivo informa função da página, CTA, SEO e seções;
- cada seção informa função, conteúdo sugerido e observações de implementação;
- o conteúdo foi escrito para encaixar na arquitetura atual, sem depender de interpretação posterior.

## Estrutura

```txt
content/
  pages/
    home.md
    servicos.md
    sobre.md
    contato.md
    trabalhe-conosco.md
```

## Regras usadas

- Diagnóstico antes de plano.
- Clareza antes de velocidade.
- Uma página, uma promessa principal.
- Um CTA primário por página.
- Conteúdo por função de seção, não por decoração.
- Nada de promessa inflada, urgência artificial ou linguagem genérica.
- Provas e cases não devem ser inventados; devem ser preenchidos com dados reais.

## Próximo bloco recomendado

Depois deste pacote, o próximo bloco natural é:

```txt
content/services/
  branding-identidade.md
  desenvolvimento-web.md
  gestao-redes-sociais.md
  producao-audiovisual.md
  assessoria-marketing-estrategico.md
  process-intelligence.md
  process-activation.md
  hospedagem-manutencao.md
```
