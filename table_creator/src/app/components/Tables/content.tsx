


export const content = [
  {
    //label: "Профиль/позиция",
    label: "Должность",
    fieldName: "job_profile.speciality",
    filter: true,
    display: true,
  },
  {
    label: "Название",
    fieldName: "name",
    filter: true,
    display: false,
  },
  {
    label: "Статус",
    fieldName: "status",
    filter: true,
    formatter: "statusFormatter", 
    html: true,
    display: true,
  },

  {
    label: "Подразделение",
    fieldName: "job_profile.org_unit",
    filter: true,
    display: true,
  },
  
  {
    label: "Специальность",
    fieldName: "criteria.speciality",
    filter: true,
    display: true,
  },

  {
    label: "Ответственный",
    fieldName: "responsible",
    filter: true,
    display: true,
  },
  

  {
    label: "Дата открытия",
    fieldName: "created_at",
    formatter: "dateFormatter", 
    display: true,
  },
  {
    label: "Дата закрытия",
    fieldName: "deadline",
    formatter: "dateFormatter", 
    display: true,
  },
  {
    label: "Номер",
    fieldName: "id",
    sorter: true,
    display: true,
  },

  
  {
    label: "Комментарий",
    fieldName: "description",
    display: true,
  },
];

//export type TContent = typeof content[number];
