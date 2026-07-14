# TAG08 Icon & Motion System

## Bibliotecas oficiais

- Ícones: `lucide-react`
- Animações de UI: `motion/react`
- Transições simples: CSS/Tailwind

## Bibliotecas não padrão

- Rive: permitido apenas para interações especiais, mediante decisão explícita.
- Lottie: permitido apenas para vinhetas ou estados controlados, mediante decisão explícita.
- Outras bibliotecas de ícones: não usar sem aprovação.

## Princípios

1. Ícone não é decoração solta.
2. Ícone deve reforçar leitura, função ou ação.
3. Animação deve orientar, confirmar, transicionar ou reduzir fricção.
4. Nenhuma animação deve existir apenas para impressionar.
5. Toda animação precisa respeitar performance e acessibilidade.
6. Em mobile, reduzir peso visual e evitar excesso de movimento.
7. Em páginas longas, animação deve ser sutil.
8. Em componentes reutilizáveis, preferir padrões compartilhados.

## Padrão de ícones

- Biblioteca: `lucide-react`.
- Stroke recomendado: 1.5 a 2.
- Tamanhos comuns: 16, 18, 20, 24.
- Usar em:
  - cards de serviço;
  - diagnóstico;
  - FAQ;
  - CTAs;
  - badges;
  - etapas de método;
  - navegação.
- Evitar:
  - ícone repetido sem função;
  - ícone que compete com o texto;
  - mistura de estilos visuais.

## Padrão de motion

- Biblioteca: `motion/react`.
- Usar em:
  - entrada discreta de blocos;
  - troca de depoimentos;
  - abertura/fechamento de FAQ;
  - menu mobile;
  - dropdown;
  - feedback de seleção;
  - simuladores.
- Evitar:
  - parallax gratuito;
  - delays longos;
  - animações em excesso;
  - movimento forte em cards longos;
  - animação que atrapalha leitura.

## Durações recomendadas

- Microinteração: 0.16s a 0.24s.
- Entrada de card/seção: 0.25s a 0.45s.
- Troca de conteúdo: 0.25s a 0.4s.
- Menus/dropdowns: 0.18s a 0.28s.

## Reduced motion

Quando possível, usar:

- `useReducedMotion` do `motion/react`;
- CSS `prefers-reduced-motion`.

Se reduced motion estiver ativo:

- reduzir deslocamento;
- manter fade simples;
- remover movimentos decorativos.

## Estado atual no projeto

- `lucide-react` já é a biblioteca dominante de ícones nas páginas e componentes.
- `motion/react` já é usado para animações de layout, transições e interações.
- Componentes com movimento mais perceptível devem respeitar `useReducedMotion` antes de ganhar novos efeitos.
