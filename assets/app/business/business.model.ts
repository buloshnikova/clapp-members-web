export class Business {
    constructor(
        public email: string,
        public password: string,
        public title?: string,
        public info?: string,
        public logo?: string,
        public categories?: any[],
        public locations?: any[],
        public coupons?: any[],
        public _id?: string ) {

    }
}