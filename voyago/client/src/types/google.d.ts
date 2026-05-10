declare namespace google.accounts.id {
  function initialize(config: {
    client_id: string;
    callback: (response: { credential: string; select_by?: string }) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }): void;
  function prompt(notification?: (n: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void): void;
  function renderButton(parent: HTMLElement, config: {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    width?: number;
    logo_alignment?: 'left' | 'center';
  }): void;
  function revoke(email: string, callback: () => void): void;
}

declare class Razorpay {
  constructor(options: Record<string, unknown>);
  open(): void;
  on(event: string, handler: (...args: unknown[]) => void): void;
}
