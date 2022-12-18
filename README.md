<p align='center'>
  <picture>
    <source media='(prefers-color-scheme: dark)' srcset='assets/social/under-control-banner.png'>
    <img src='assets/social/under-control-banner.png' alt='Banner'>
  </picture>

  <h1 align='center'>under-control</h1>
</p>

<div align='center'>

[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/00361e89d67049baa02723ee0e818ed0?style=for-the-badge)](https://www.codacy.com/gh/Mati365/under-control/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Mati365/under-control&utm_campaign=Badge_Coverage)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/00361e89d67049baa02723ee0e818ed0)](https://www.codacy.com/gh/Mati365/under-control/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Mati365/under-control&utm_campaign=Badge_Grade)
[![NPM](https://img.shields.io/npm/l/under-control?style=flat)](LICENSE)
[![NPM downloads](https://img.shields.io/npm/dm/under-control?style=flat&label=NPM)](https://www.npmjs.com/package/under-control)
![GitHub package.json version](https://img.shields.io/github/package-json/v/Mati365/under-control?style=flat)

</div>

<p align='center'>
  Are you losing sanity every time you need to make a form? Are you tired enough of all antipatterns and cursed React frameworks? Screw that! Treat all forms and inputs as a recursive composable controls!
</p>

## Features

### Utils

- Hook that binds controls to state
- Hook that implements simple form submitting / validation logic
- Decorator that makes any passed component controllable
- ... and nothing more

### TypeScript integration

![Object type check example](assets/examples/type-check-object.png 'Type check object with array')

## Install

```bash
npm install @under-control/forms
```

## Usage

### useControl

Bind entire state to input:

```tsx
const Component = () => {
  const { bind } = useControl({
    defaultValue: 'Hello world',
  });

  return <input type="text" {...bind.entire()} />;
};
```

Bind single state property to input:

```tsx
const Component = () => {
  const { bind } = useControl({
    defaultValue: {
      message: {
        nested: ['Hello world'],
      },
    },
  });

  return <input type="text" {...bind.path('message.nested[0]')} />;
};
```

## License

[MIT](LICENSE)
