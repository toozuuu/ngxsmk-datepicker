import { provideMaterialFormFieldControl } from './material-form-field.helper';
import { Provider } from '@angular/core';

type ProviderWithProperties = Provider & {
  provide?: unknown;
  useExisting?: unknown;
  multi?: boolean;
};

/** Object token that passes isWrongToken (avoids patching component with a Symbol, which breaks later tests when Angular sets __NG_ELEMENT_ID__ on the token). */
function createMockControlToken(): object {
  return { toString: () => 'MatFormFieldControl' };
}

describe('provideMaterialFormFieldControl', () => {
  it('should return a provider', () => {
    const mockToken = createMockControlToken();
    const provider = provideMaterialFormFieldControl(mockToken) as ProviderWithProperties;

    expect(provider).toBeTruthy();
    expect(provider.provide).toBe(mockToken);
  });

  it('should use forwardRef to NgxsmkDatepickerComponent', () => {
    const mockToken = createMockControlToken();
    const provider = provideMaterialFormFieldControl(mockToken) as ProviderWithProperties;

    expect(provider.useExisting).toBeTruthy();
    expect(provider.multi).toBe(false);
  });

  it('should set multi to false', () => {
    const mockToken = createMockControlToken();
    const provider = provideMaterialFormFieldControl(mockToken) as ProviderWithProperties;

    expect(provider.multi).toBe(false);
  });

  it('should throw when token is missing', () => {
    expect(() => provideMaterialFormFieldControl(null!)).toThrow();
    expect(() => provideMaterialFormFieldControl(undefined!)).toThrow();
  });

  it('should throw when token is MAT_FORM_FIELD (wrong token)', () => {
    const wrongToken = { toString: () => 'MatFormField' };
    expect(() => provideMaterialFormFieldControl(wrongToken)).toThrow();
  });
});
