interface IVerses {
    chapter:string;
    verse:string;
    name:string;
    text:string
}
export interface IBibleBook{
    abbreviation:string;
    lang?:string;
    language?:string;
    direction?:string;
    encoding?:string;
    number:number;
    name:string;
    url:string;
    sha?:string
}
export interface IBibleChapter {
    translation:string;
    abbreviation:string;
    lang:string;
    direction:string;
    encoding:string;
    book_number:string;
    book_name:string;
    chapter:string;
    name:string;
    url:string;
    sha:string
}
export interface IBibleVerses {
    translation:string;
    abbreviation:string;
    lang:string;
    language:string;
    direction:string;
    encoding:string;
    book_nr:number;
    book_name:string;
    chapter:number;
    name:string;
    verses:IVerses[]
}