# Aula — Tu espacio de estudio

SPA en **Angular 21** que reconstruye una vieja app escolar de HTML/CSS plano,
ahora con una arquitectura profesional basada en **DDD**, **Clean Architecture**
y **SOLID**, organizada por **bounded contexts**.

No tiene IAM: es una app de un solo usuario que consume una API REST local
(`json-server`) con CRUD completo sobre un `db.json`.

## Secciones (bounded contexts)

| Ruta | Contexto | Qué hace |
|------|----------|----------|
| `/tablero` | **board** | Notas de estudio visuales (imágenes) agrupadas por día y materia. |
| `/calendario` | **scheduling** | Agenda académica sobre una grilla mensual (exámenes, tareas, clases). |
| `/examenes` | **assessment** | Cuestionarios de opción múltiple con evaluación de intentos. |
| `/cuaderno` | **notebook** | Cuadernos con páginas para leer y editar. |

## Arquitectura

Cada contexto se divide en **cuatro capas** con dependencias apuntando siempre
hacia el dominio:

```
<context>/
├── domain/          # entidades, value objects, reglas de negocio (sin Angular)
│   └── model/
├── application/     # stores con signals: orquestan los casos de uso
├── infrastructure/  # HttpClient, assemblers (resource <-> entity), facades (API)
└── presentation/    # components, views y dialogs; <context>.routes.ts lazy
```

El **shared kernel** (`src/app/shared`) contiene las clases base reutilizables:

- `BaseEntity`, `Subject` (concepto publicado, compartido entre contextos)
- `BaseApiEndpoint<TEntity, TResource, TResponse, TAssembler>` — CRUD genérico
- `BaseAssembler`, `BaseApi`, `BaseResponse`, `ErrorHandlingEnabledBaseType`
- Shell de layout, vistas comunes (home, about, 404) e i18n

### Principios SOLID aplicados

- **S**: cada clase tiene una sola razón para cambiar (assembler traduce, endpoint transporta, store orquesta).
- **O**: `BaseApiEndpoint` se extiende por contexto sin modificarse.
- **L**: cualquier `*ApiEndpoint` es sustituible por su base.
- **I**: interfaces pequeñas (`BaseAssembler`, `BaseEntity`).
- **D**: la presentación depende de abstracciones (stores/facades), no de HTTP directo.

## Cómo correr

Requisitos: **Node 20+**.

```bash
npm install

# 1) levantar la API REST (json-server en :3000)
npm run server

# 2) en otra terminal, la app Angular (:4200)
npm start
```

O ambos a la vez:

```bash
npm run dev
```

La app queda en `http://localhost:4200` y consume `http://localhost:3000/api/v1`.

## Stack

Angular 21 · Angular Material 3 · TypeScript · RxJS · Signals ·
@ngx-translate (es/en) · json-server · SweetAlert2

## Paleta

Tema académico "tinta y papel": fondo papel `#f5f6f8`, tinta `#1b1f2a`,
índigo `#3d4db7` como acento y ámbar `#e0a458` como único subrayador
(la clase `.marker`). Materias con color propio (mate, física, lenguaje, compu).
