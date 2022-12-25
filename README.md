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
[![NPM](https://img.shields.io/npm/l/@under-control/core?style=flat)](LICENSE)
![NPM Downloads](https://img.shields.io/npm/dm/@under-control/core)
![NPM version](https://img.shields.io/npm/v/@under-control/core)

</div>

<p align='center'>
  Are you losing sanity every time you need to make a form? Are you tired enough of all antipatterns and cursed React frameworks? Screw that! Treat all forms and inputs as a recursive composable controls!
</p>

## Install

If you want only control bind functions:

![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@under-control/inputs)

```bash
npm install @under-control/inputs
```

If you want form utils (it uses `@under-control/inputs` as dependency):

![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@under-control/forms)

```bash
npm install @under-control/forms
```

## Features

### Utils

- Hook that binds controls to state
- Hook that implements simple form submitting / validation logic
- Decorator that makes any passed component controllable
- ... and nothing more

### TypeScript integration

![Object type check example](assets/examples/type-check-object.png 'Type check object with array')

### Composition

Build and treat your forms as composable set of controlled components. Do not mess with implementing `value` / `onChange` logic each time when you create standalone controls.

Example:

```tsx
import { controlled } from '@under-control/inputs';

type PrefixValue = {
  prefix: string;
  name: string;
};

const PrefixedInput = controlled<PrefixValue>()(({ control: { bind } }) => (
  <>
    <input type="text" {...bind.path('prefix')} />
    <input type="text" {...bind.path('name')} />
  </>
));
```

Usage in bigger component:

```tsx
import { controlled } from '@under-control/inputs';
import { PrefixedInput } from './prefixed-input';

type PrefixPair = {
  a: PrefixValue;
  b: PrefixValue;
};

const PrefixedInputGroup = controlled<PrefixPair>()(({ control: { bind } }) => (
  <>
    <PrefixedInput {...bind.path('a')} />
    <PrefixedInput {...bind.path('b')} />
  </>
));
```

`onChange` output from `PrefixedInput` component:

```tsx
{
  a: { prefix, name },
  b: { prefix, name }
}
```

## Usage

### useForm

Create basic form with `PrefixedInputs` from previous example.

```tsx
const createPrefixPair = (): PrefixPair => ({
  prefix: '',
  name: '',
});

const Component: FC = () => {
  const { bind, handleSubmitEvent } = useForm({
    defaultValue: {
      a: createPrefixPair(),
      b: createPrefixPair(),
    },
    onSubmit: async data => {
      console.info('Submit!', data);
    },
  });

  return (
    <form onSubmit={handleSubmitEvent}>
      <PrefixedInput type="text" {...bind.path('a')} />
      <PrefixedInput type="text" {...bind.path('b')} />
      <input type="submit" value="Submit" />
    </form>
  );
};
```

### useControl

Bind entire state to input:

```tsx
import { useControl } from '@under-control/inputs';

const Component = () => {
  const { bind } = useControl({
    defaultValue: 'Hello world',
  });

  return <input type="text" {...bind.entire()} />;
};
```

Bind single state property to input:

```tsx
import { useControl } from '@under-control/inputs';

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

Map single property and map it to input:

```tsx
import { useControl } from '@under-control/inputs';

const Component = () => {
  const { bind } = useControl({
    defaultValue: {
      message: {
        nested: ['Hello world'],
      },
    },
  });

  return (
    <input
      type="text"
      {...bind.path('message.nested[0]', {
        input: str => `${str}!`, // appends `!` value stored in message.nested[0]
      })}
    />
  );
};
```

## License

[MIT](LICENSE)
