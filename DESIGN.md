---
version: alpha
name: SG Consultora — Stefanny Gutierres
description: Sistema de design para o redesign do site sgconsultoraimobiliaria.com.br — consultoria de vendas imobiliárias com curadoria de empreendimentos. Direção "quiet luxury" editorial, preto-café e dourado champanhe.
colors:
  # Marca (herdados do logo e do tailwind atual)
  brand-gold: '#C5A059'
  brand-gold-light: '#E5C48B'
  brand-gold-deep: '#8B5E3C'
  # Tema escuro (padrão do hero, cases, header e footer)
  ink: '#0A0A0A'
  canvas-dark: '#0E0C0A'
  surface-dark: '#16130F'
  surface-dark-raised: '#1E1A15'
  stroke-dark: '#2E281F'
  text-on-dark: '#F5F1E8'
  text-on-dark-muted: '#B5AC9C'
  # Tema claro (seções de respiro, empreendimentos, contato)
  canvas-light: '#FAF8F3'
  surface-light: '#FFFFFF'
  surface-light-alt: '#F3EEE3'
  stroke-light: '#E6DFD0'
  text-strong: '#14110D'
  text-base: '#4A443B'
  text-muted: '#7A7265'
  # Ação e estados
  primary: '#C5A059'
  primary-hover: '#D6B472'
  on-primary: '#0A0A0A'
  primary-ink: '#735832'
  success: '#2F7D5B'
  danger: '#B3261E'
  whatsapp: '#25D366'
typography:
  display-xl:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.015em
  headline:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.22em
  numeral:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 14px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  section: 128px
  section-mobile: 80px
  container: 1280px
  gutter: 24px
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    rounded: '{rounded.sm}'
    padding: 16px 28px
    typography: '{typography.label}'
  button-primary-hover:
    backgroundColor: '{colors.primary-hover}'
  button-ghost-dark:
    backgroundColor: transparent
    textColor: '{colors.text-on-dark}'
    borderColor: '{colors.brand-gold-light}'
    rounded: '{rounded.sm}'
  button-whatsapp:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.text-on-dark}'
    borderColor: '{colors.whatsapp}'
    rounded: '{rounded.full}'
  property-card:
    backgroundColor: '{colors.surface-light}'
    textColor: '{colors.text-strong}'
    borderColor: '{colors.stroke-light}'
    rounded: '{rounded.md}'
  case-card:
    backgroundColor: '{colors.surface-dark}'
    textColor: '{colors.text-on-dark}'
    borderColor: '{colors.stroke-dark}'
    rounded: '{rounded.md}'
  kicker:
    textColor: '{colors.primary-ink}'
    typography: '{typography.label}'
  kicker-dark:
    textColor: '{colors.brand-gold-light}'
    typography: '{typography.label}'
  input:
    backgroundColor: '{colors.surface-light}'
    textColor: '{colors.text-strong}'
    borderColor: '{colors.stroke-light}'
    rounded: '{rounded.sm}'
    height: 52px
  header-scrolled:
    backgroundColor: '{colors.canvas-dark}'
    textColor: '{colors.text-on-dark}'
  footer:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.text-on-dark-muted}'
---

# DESIGN.md — SG Consultora (Stefanny Gutierres)

> Documento-fonte para o Google Stitch gerar o redesign do site da consultora de vendas imobiliárias Stefanny Gutierres. Segue a especificação aberta `google-labs-code/design.md` (versão `alpha`): tokens normativos no front matter, seções obrigatórias na ordem da spec e seções extras ao final. Mantém o logo, o preto e o dourado da marca e eleva o visual para o padrão de incorporadoras e boutiques imobiliárias de alto padrão.

## Overview

**Quem é:** Stefanny Gutierres, consultora de vendas imobiliárias. Faz diagnóstico do perfil do comprador, curadoria de empreendimentos (com autorização comercial das incorporadoras) e condução comercial até a incorporadora.

**Restrição legal (obrigatória em toda copy):** não é corretora e **não possui registro CRECI**. Nunca usar "corretora", "corretagem" ou "intermediação". O site já informa isso — manter discreto, porém visível (rodapé e seção Serviços).

**Público:** compradores de imóveis na planta / lançamentos e investidores que querem orientação pessoal antes de visitar estande; decisão de alto valor, guiada por confiança.

**Promessa:** "Curadoria pessoal antes da visita — a escolha certa, sem perder tempo."

**Tom de voz:** pessoal (1ª pessoa da consultora: "Atuo…", "Estou pronta…"), elegante, objetivo, acolhedor. Sem jargão de corretor, sem urgência agressiva, sem exclamações em excesso. pt-BR.

**Personalidade visual — "quiet luxury" editorial:** revista de arquitetura, não portal de anúncios. Fotografia grande dos empreendimentos, muito respiro, serifas elegantes, dourado usado como fio de luz (linhas, numerais, detalhes), nunca em blocos chapados. Concorrentes do segmento costumam usar grids lotados de cards, azul genérico e banners de "oferta"; aqui a diferenciação é a calma, a curadoria e a presença pessoal da consultora.

## Colors

Tokens no front matter. Princípios:

- **Marca (do logo e do `tailwind.config.ts` atual):** dourado champanhe `brand-gold #C5A059`, claro `#E5C48B`, profundo `#8B5E3C` (gradiente "gold shine" atual: `#F9E29C → #C5A059 → #805A26`, reservado a fios, numerais e ao monograma).
- **Escuro (hero, cases, header rolado, footer, CTA final):** preto-café quente (`ink #0A0A0A`, `canvas-dark #0E0C0A`, `surface-dark #16130F`) — preto puro só no `ink`. Texto `#F5F1E8` (marfim), secundário `#B5AC9C`.
- **Claro (empreendimentos, serviços, contato, páginas de listagem/detalhe):** marfim `#FAF8F3`, cartões brancos, alternância com `#F3EEE3`. Texto `#14110D` / `#4A443B` / `#7A7265`. Substitui o `slate-*` frio atual.
- **Ação:** CTA principal dourado com texto `ink` (contraste ≈ 8:1). Em fundo claro, texto/ícones dourados usam `primary-ink #735832` (AA para texto pequeno); o `#C5A059` sobre branco é só decorativo.
- **WhatsApp:** verde `#25D366` apenas como ícone/borda do botão flutuante e do CTA WhatsApp, nunca como fundo de seção.
- **Proporção:** ~60% neutros claros, ~30% escuros, ≤10% dourado.

## Typography

Google Fonts: **Playfair Display** (mantida — já é a serifa da marca) para títulos e numerais; **Manrope** (substitui Montserrat — **aprovado** pela cliente; o `tailwind.config` ainda usa Montserrat até a implementação) para texto e UI — mais contemporânea e legível, menos "genérica". Fallbacks: `Georgia, serif` / `ui-sans-serif, system-ui`.

- Títulos em Playfair 600, tracking negativo leve; itálico 500 para 1–2 palavras de ênfase em dourado ("a escolha _certa_").
- `label` (kickers e microcopy de seção) em caixa alta com tracking 0.22em, como o `section-kicker` atual — sem pílula com borda; usar fio dourado de 48px antes do texto.
- Numerais (stats, "Etapa 01", contagem regressiva) em Playfair `numeral`.
- Corpo 16–18px, linha 1.65–1.7, medida máx. 68 caracteres.
- Mobile: `display-xl` → 40px, `display-lg` → 34px, `headline` → 26px.

## Layout

- Container 1280px, gutter 24px (mobile 20px). Grid de 12 colunas; composições assimétricas (7/5, 5/7) em vez de tudo centralizado.
- Ritmo vertical: seções com 128px (desktop) / 80px (mobile); blocos internos em 40/64px.
- Alternância de fundos: escuro (hero) → claro (empreendimentos) → claro alt (serviços) → escuro (cases) → claro (contato) → escuro (CTA final + footer).
- Listagem `/empreendimentos`: filtro por categoria em barra horizontal fina + grid 3/2/1 colunas.
- Detalhe `/empreendimentos/[slug]`: hero full-bleed com foto de capa, depois layout 8/4 com conteúdo à esquerda e card fixo (sticky) de contato/WhatsApp à direita.

## Elevation & Depth

- Superfícies claras: borda `stroke-light` 1px + sombra muito suave (`0 1px 2px rgba(20,17,13,.04), 0 12px 32px rgba(20,17,13,.06)`); hover eleva para `0 20px 48px rgba(20,17,13,.10)`.
- Superfícies escuras: sem sombra; profundidade via camadas (`canvas-dark` → `surface-dark` → `surface-dark-raised`) e um glow radial dourado muito sutil (`rgba(197,160,89,.07)`, como o `footer-bar-glow` atual).
- Fotografia com overlay em gradiente `ink` (esquerda → direita e base → topo) para legibilidade do hero.
- Header: transparente sobre o hero; ao rolar, `canvas-dark` com `backdrop-blur` 14px e fio inferior em gradiente dourado (mantém o `header-bar-scrolled` atual).
- Fios dourados de 1px (gradiente `transparent → #E5C48B → transparent`) como divisores premium.

## Shapes

- Raios contidos: botões e inputs `sm` (4px), cards e imagens `md` (8px), modais/drawer `lg` (14px). Pílula (`full`) só para chips de destaque e botão flutuante do WhatsApp.
- Imagens de empreendimento em proporção 4:5 (cards) e 16:9/21:9 (heros); cantos `md`.
- Molduras finas (inset 1px dourado a 30%) em fotos de destaque, evocando passe-partout.

## Components

- **Header:** logo-mark à esquerda; links "Empreendimentos · Serviços · Cases · Contato" em Manrope 14px; CTA "Falar no WhatsApp" (`button-ghost-dark`). Mobile: drawer escuro em tela cheia com links em Playfair 28px.
- **Hero (FeaturedHero):** foto full-bleed do empreendimento em destaque (dados do admin), kicker "Projeto em destaque" com fio dourado, título `display-xl`, localização com ícone de pin, descrição curta, 3 "sinais" (ex.: fase da obra, unidades disponíveis, entrega — vindos do cadastro) em mini-cards de vidro escuro, chips de highlights, CTAs "Ver detalhes do empreendimento" (primário) + WhatsApp (ghost). Contagem regressiva (`CountdownTimer`) em numerais Playfair quando houver data.
- **Faixa de prova:** 3 stats em linha com numerais Playfair dourados e label (ex.: nº de empreendimentos em curadoria — dinâmico; "2h retorno em horário útil" — já existe na copy).
- **Property card:** imagem 4:5 com zoom suave no hover, chip de status/categoria, título Playfair 22px, localização, linha fina e "Ver empreendimento →".
- **Serviços / Etapas:** 3 colunas "Diagnóstico · Curadoria · Condução comercial" com numerais grandes "01/02/03" e fio dourado; aviso legal "Não sou corretora de imóveis; não possuo registro CRECI." em `text-muted` 13px.
- **Case card (SoldCaseCard):** fundo `surface-dark`, foto do imóvel vendido, aspas em Playfair itálico, nome/iniciais do cliente (com autorização), empreendimento.
- **Formulário de contato:** card branco; campos Nome, E-mail, Telefone, Tipo de imóvel (Apartamento/Casa/Terreno/Comercial/Investimento), Mensagem (500 caracteres); labels acima, altura 52px, foco com anel `primary-ink`; botão dourado de largura total; microcopy de privacidade. Ao lado: retrato oficial da consultora (`apps/web/public/img/consultora.webp`, 800px; original `consultora.png` 1080px) + diferenciais.
- **Retrato oficial:** gola alta azul-marinho, pele em tons quentes e fundo neutro claro. Combina com a paleta: o marinho funciona como um escuro frio que contrasta com o dourado champanhe sem competir; a pele quente conversa com o dourado e o marfim; o fundo claro se integra às seções `surface-ivory`/branco. Usar em moldura retangular com raio `rounded.md` e, opcionalmente, um filete dourado de 1px; nunca aplicar filtro que esfrie a pele. Em seções escuras, preferir enquadramento com respiro (o fundo claro vira um "recorte" luminoso).
- **CTA final:** faixa escura, título "Receba a curadoria antes de visitar o empreendimento." + botão "Falar agora".
- **Footer:** `logo-footer`, navegação, contato, aviso CRECI, créditos; fio dourado no topo.
- **WhatsApp flutuante:** botão circular `ink` com ícone verde e borda verde, canto inferior direito, 56px.
- **Galeria (detalhe):** grid mosaico + lightbox escuro; seção "Planta do projeto" em fundo claro alt.
- **Admin:** mesmo sistema em versão funcional — sidebar 16rem escura, conteúdo claro, tabelas densas; sem efeitos decorativos.

## Do's and Don'ts

**Do**

- Fotografia real dos empreendimentos em destaque, grande e com respiro.
- Dourado como luz: fios, numerais, ícones, ênfases em itálico.
- Copy em 1ª pessoa, curta, pessoal e verdadeira.
- Manter o aviso "sem registro CRECI" visível e discreto.

**Don't**

- Não usar "corretora", "corretagem", "intermediação", nem "melhor preço/garantido".
- Não usar fundos dourados chapados, gradientes arco-íris, azul "imobiliária genérica" ou banners de oferta piscando.
- Não inventar números (VGV, clientes atendidos, anos de mercado) — só dados reais fornecidos.
- Não usar fotos de banco genéricas de casais com chave; não colocar texto sobre foto sem overlay.

## Motion

- Duração 200–600ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Hero: fade + translateY 16px escalonado (título → descrição → sinais → CTAs); imagem com leve ken-burns (escala 1.04 → 1, 1.2s).
- Reveal ao rolar: fade-up 24px, uma vez por elemento.
- Cards: hover com zoom de imagem 1.03 e elevação de sombra; fio dourado cresce de 0 a 48px no kicker.
- `prefers-reduced-motion`: desativar parallax, ken-burns e reveals (apenas fade 150ms).

## Accessibility

- Contraste AA: texto pequeno dourado só em `primary-ink #735832` sobre claro ou `#E5C48B` sobre escuro; CTA dourado com texto `ink`.
- Foco visível em todos os interativos (anel 2px `primary-ink` / `brand-gold-light` no escuro, offset 2px).
- Hierarquia: um `h1` por página (hero/título do empreendimento); `h2` por seção.
- Alvos de toque ≥ 44px; labels reais nos inputs; mensagens de erro/sucesso com `aria-live`.
- `alt` descritivo nas fotos de empreendimento; ícones decorativos com `aria-hidden`.
- Contagem regressiva não deve anunciar cada segundo a leitores de tela.

## Page Structure

**Home (`/`)** — âncoras existentes devem ser mantidas:

1. Header (transparente sobre o hero)
2. Hero — empreendimento em destaque (`FeaturedHero`)
3. `#empreendimentos` — "Oportunidades selecionadas": texto de autorização comercial + faixa de stats + grid de `ProjectCard` + link "Ver todos"
4. `#servicos` — "Consultoria de vendas imobiliárias": 3 etapas + aviso CRECI
5. `#cases` — "Histórias de quem comprou com a consultoria": grid de `SoldCaseCard` + CTA "Quero minha história de compra"
6. `#contato` — "Agende sua consultoria": diferenciais + formulário
7. CTA final escuro
8. Footer + WhatsApp flutuante

**Empreendimentos (`/empreendimentos`)** — hero escuro curto com título, filtro por categoria, grid de cards, estado vazio elegante.

**Detalhe (`/empreendimentos/[slug]`)** — hero com capa, título, localização, sinais e CTAs; "Sobre o empreendimento"; galeria; "Planta do projeto"; card sticky de contato; CTA final.

## Stitch Prompts

### Prompt base — home desktop

```text
Design a premium, editorial "quiet luxury" landing page (desktop, 1440px) for a Brazilian real estate sales consultant, "Stefanny Gutierres — Consultoria de Vendas Imobiliárias". All copy in Brazilian Portuguese. She is NOT a licensed broker: never use the words "corretora" or "corretagem".
Palette: warm near-black #0E0C0A and #16130F for dark sections, ivory #FAF8F3 and white for light sections, champagne gold #C5A059 (light #E5C48B) used sparingly as thin lines, numerals and the primary button (gold button with black text). Typography: Playfair Display for headings and numerals, Manrope for body and UI; uppercase tracked labels preceded by a 48px gold hairline.
Sections in order: transparent header over hero (logo left, links Empreendimentos · Serviços · Cases · Contato, outline WhatsApp button); full-bleed hero photo of a modern high-rise development with dark gradient overlay, kicker "PROJETO EM DESTAQUE", large serif title, location with pin icon, short description, three small glass stat cards, buttons "Ver detalhes do empreendimento" and "Falar no WhatsApp"; light section "Oportunidades selecionadas" with a three-stat strip and a 3-column grid of property cards (4:5 photos, status chip, serif title, location, "Ver empreendimento →"); section "Consultoria de vendas imobiliárias" with three numbered steps 01 Diagnóstico, 02 Curadoria, 03 Condução comercial and a small disclaimer line; dark section "Histórias de quem comprou com a consultoria" with testimonial cards featuring property photos and italic serif quotes; contact section "Agende sua consultoria" with benefits on the left and a white form card (Nome, E-mail, Telefone, Tipo de imóvel, Mensagem, full-width gold button "Solicitar contato"); dark closing CTA "Receba a curadoria antes de visitar o empreendimento."; footer with gold top hairline. Floating circular WhatsApp button bottom-right.
Use the uploaded photo (consultora.png — consultant in a navy turtleneck, warm skin tones, light neutral background) as the official portrait next to the contact form and in an "about" block; do not generate or replace her face.
Generous whitespace, asymmetric grids, small radii (4–8px), soft shadows, no stock photos of people holding keys, no flat gold backgrounds.
```

### Prompt mobile

```text
Same design system, mobile 390px. Header with logo and hamburger opening a full-screen dark drawer with serif links. Hero stacks: photo with overlay, title 40px, location, stat cards in a horizontal scroll row, full-width stacked buttons. Property cards one per row, stats as a 3-column compact strip. Steps stacked with large gold numerals. Testimonials as a horizontal swipe carousel. Form full width with 52px inputs. Sticky floating WhatsApp button 56px. Section padding 80px.
```

### Prompts de refinamento

```text
1. Make the hero feel more like an architecture magazine cover: larger photo, more negative space, title in Playfair Display with one italic gold word.
2. Replace any cool grays with warm ivory/stone neutrals from the palette; keep gold under 10% of the surface.
3. Create the property detail page: full-bleed cover, 8/4 layout with sticky contact card (WhatsApp + form), masonry gallery, "Planta do projeto" section on #F3EEE3.
4. Create the /empreendimentos listing: short dark hero, thin horizontal category filter, 3-column grid, elegant empty state.
5. Check WCAG AA contrast: small gold text on light backgrounds must use #735832.
6. Admin variant: dark 16rem sidebar, light content area, dense tables, no decorative effects.
```

> **Retrato:** ao gerar no Stitch, faça upload de `apps/web/public/img/consultora.png` junto com o prompt base.
>
> **Placeholders:** fotos de empreendimentos, depoimentos e números nos prompts são ilustrativos para o Stitch — no site usar apenas dados reais do admin/cliente. O "2h de retorno" e a contagem de empreendimentos já existem no site atual; qualquer outro número é placeholder.
