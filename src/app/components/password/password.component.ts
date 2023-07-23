import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  strength: string;
  hide: boolean = false;
  typeFirst: string = 'password';
  typeSecond: string = 'password';
  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      password: fb.control('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator,
      ]),
      confirm: fb.control('', [Validators.required, Validators.minLength(8)]),
    });

    this.form.addValidators(
      createCompareValidator(
        this.form.get('confirm'),
        this.form.get('password')
      )
    );
  }

  get password(): AbstractControl {
    return this.form.controls.password as FormControl;
  }
  get confirm(): AbstractControl {
    return this.form.controls.confirm as FormControl;
  }

  public passwordValidator(control: FormControl): ValidationErrors | null {
    const value = control.value;

    const hasNumber = /[0-9]/.test(value);
    const hasSymbols = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    const isLengthValid = value ? value.length > 7 : false;

    if (isLengthValid && hasLetter && hasNumber && hasSymbols) {
      return { max: true };
    }
    if (isLengthValid && hasLetter && hasNumber) {
      return { normal: true };
    }
    if ((isLengthValid && hasLetter) || (isLengthValid && hasNumber)) {
      return { allowable: true };
    }

    return null;
  }

  public passChanged() {
    if (this.password.errors?.['allowable']) {
      this.strength = 'low';
      return;
    }
    if (this.password.errors?.['normal']) {
      this.strength = 'average';
      return;
    }
    if (this.password.errors?.['max']) {
      this.strength = 'strong';
      return;
    }
    return (this.strength = '');
  }

  showPassword(type: number) {
    if (type === 1) {
      this.typeFirst === 'password'
        ? (this.typeFirst = 'text')
        : (this.typeFirst = 'password');
    }
    if (type === 2) {
      this.typeSecond === 'password'
        ? (this.typeSecond = 'text')
        : (this.typeSecond = 'password');
    }
  }

  submit() {
    // console.log(this.form.value);
    this.hide = true;

    setTimeout(() => {
      this.hide = false;
    }, 3000);

    this.strength = '';
    this.form.reset();
  }

  ngOnInit(): void {}
}

function createCompareValidator(
  controlOne: AbstractControl | null,
  controlTwo: AbstractControl | null
) {
  return () => {
    if (controlOne?.value !== controlTwo?.value)
      return { match_error: 'Value does not match' };
    return null;
  };
}
