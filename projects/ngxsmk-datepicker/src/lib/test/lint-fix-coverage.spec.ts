import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

describe('NgxsmkDatepickerComponent Coverage Boost', () => {
  it('should patch def providers', () => {
    const patchDefProviders = (NgxsmkDatepickerComponent as any)._patchDefProviders;
    const def: any = { providers: [] };
    patchDefProviders(def, 'TOKEN', 'PROVIDER');
    expect(def.providers).toContain('PROVIDER');
  });

  it('should patch resolver results', () => {
    const patchResolverResult = (NgxsmkDatepickerComponent as any)._patchResolverResult;
    const result: any = [];
    patchResolverResult(result, 'TOKEN', 'PROVIDER');
    expect(result).toContain('PROVIDER');
  });

  it('should handle material support static call on mock', () => {
    class MockComp {
      static ɵcmp: any = { providers: [], type: MockComp };
    }
    const token = { toString: () => 'MatFormFieldControl' };
    expect(() => NgxsmkDatepickerComponent.withMaterialSupport(token, MockComp)).not.toThrow();
    expect((MockComp.ɵcmp.providers as any[]).length).toBeGreaterThan(0);
  });

  it('should detect environment-specific features gracefully', () => {
    // Check if private method doesn't crash
    const comp = Object.create(NgxsmkDatepickerComponent.prototype);
    (comp as any).touchService = { handleDateCellTouchStart: () => {} }; // Mock touchService if needed
    expect(() => (comp as any).isIonicEnvironment()).not.toThrow();
  });
});
