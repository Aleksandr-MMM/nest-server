export type ClassType<T> = new (...args: any[]) => T;
export type AbstractClassType<T> = abstract new (...args: any[]) => T;
