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
  Are you losing sanity every time you need to make a form? Are you tired enough of all antipatterns and cursed React frameworks? Screw that! Treat all forms and inputs as a recursive composable controls! <b>under-control</b> is a lightweight alternative to libraries such as <b>react-hook-form</b>, <b>formik</b>, <b>react-ts-form</b>, which, unlike them, allows you to turn your components into controllable controls.
</p>

![Object type check example](assets/examples/type-check-object.png 'Type check object with array')

## 📦 Install

[![Edit React Typescript (forked)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-typescript-forked-jt16nb?fontsize=14&hidenavigation=1&theme=dark)

![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@under-control/forms)

```bash
npm install @under-control/forms
```

## ✨ Features

- Small size, it is around 4x smaller than **react-hook-form** and weights ~2.6kb (gzip).
- Performance. Automatic caching of callbacks that binds controls. Modification of control A is not triggering rerender on control B.
- Built in mind to be type-safe. Provides type-safe validation and controls binding.
- Allows you to turn any component into a control with `value` and `onChange` properties. Treat your custom select-box the same as it would be plain `<select />` tag!
- Better encapsulation of data. Due to low `context` usage it allows you to reuse built controllable controls in other forms.
- Provides rerender-free control value side effects. Modify of control can reset value of form without doing additional `useEffect`.
- Exports additional hooks such as `use-promise-callback` / `use-update-effect` that can be reused in your project.
- Highly testes codebase with 100% coverage.

### 🏗️ Composition

Build and treat your forms as composable set of controlled controls. Do not mess with implementing `value` / `onChange` logic each time when you create standalone controls.

Example:

```tsx
import { controlled } from '@under-control/forms';

type PrefixValue = {
  prefix: string;
  name: string;
};

const PrefixedInput = controlled<PrefixValue>(({ control: { bind } }) => (
  <>
    <input type="text" {...bind.path('prefix')} />
    <input type="text" {...bind.path('name')} />
  </>
));
```

Usage in bigger component:

```tsx
import { controlled } from '@under-control/forms';
import { PrefixedInput } from './prefixed-input';

type PrefixPair = {
  a: PrefixValue;
  b: PrefixValue;
};

const PrefixedInputGroup = controlled<PrefixPair>(({ control: { bind } }) => (
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

### Without validation

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

### With validation

```tsx
import { useForm } from '@under-control/forms';
import {
  flattenMessagesList,
  error,
  ValidationErrorsListProps,
} from '@under-control/validate';

type FormInputProps = JSX.IntrinsicElements['input'] &
  ValidationErrorsListProps<string>;

const FormInput = ({ errors, ...props }: FormInputProps) => (
  <>
    <input type="text" {...props} />
    <div>{flattenMessagesList(errors ?? []).join(',')}</div>
  </>
);

const Form: FC<FormProps> = ({ onSubmit }) => {
  const {
    bind,
    handleSubmitEvent,
    submitState,
    validator: { errors },
  } = useForm({
    validation: {
      mode: ['blur', 'submit'],
      validators: ({ path }) => [
        path('a', ({ value }) => {
          if (value === 'Hello') {
            return error('Error a');
          }
        }),
      ],
    },
    defaultValue: {
      a: '',
      b: '',
    },
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmitEvent}>
      <FormInput {...bind.path('a')} {...errors.extract('a')} />
      <FormInput {...bind.path('b')} {...errors.extract('b')} />

      <input type="submit" value="Submit" />

      {submitState.loading && <div>Submitting...</div>}
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
