export class CreatePlayerDto {
    name: string;
    age: number;
    height: number;
    weight: number;
    draftyear: number;
    draftround: number;
    draftnumber: number;

    college_ref?: number;
    country_ref: number;
}