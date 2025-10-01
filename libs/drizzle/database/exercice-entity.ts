export interface ExerciceEntity {
  id: string;
  title: string;
  image: string;
  difficulties: number[]; // 1: easy, 2: medium, 3: hard (all the difficulties the exercices can be)
}
