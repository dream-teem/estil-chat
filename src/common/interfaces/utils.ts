export type NullablePartial<
  T,
  NK extends keyof T = { [K in keyof T]: null extends T[K] ? K : never }[keyof T],
  NP = Partial<Pick<T, NK>> & Pick<T, Exclude<keyof T, NK>>,
> = { [K in keyof NP]: NP[K] };

export type PickNullable<T, P extends keyof T, NP = Pick<T, P>> = { [K in keyof NP]: NP[K] | null };

export type PickPartial<T, K extends keyof T> = Omit<T, K> &
Partial<Pick<T, K>>;
