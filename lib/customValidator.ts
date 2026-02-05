import { FullValueValidator, LimitValidator, Validator } from "./validation";

export function customValidator<Input>(validators: (Validator | LimitValidator | FullValueValidator)[], value: Input){
    for (let index = 0; index < validators.length; index++) {
        
        
    }
}