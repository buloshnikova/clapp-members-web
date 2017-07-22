export class Business {
    constructor(
        public email: string,
        public password: string,
        public title: string,
        public description?: string,
        public logo?: string,
        public categories?: string[],
        public locations?: string[],
        public coupons?: string[] ) {

    }
}