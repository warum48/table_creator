import dayjs from "dayjs";

export const TableFormatters = {
  dateFormatter: (value: any) => dayjs(value).format("DD.MM.YYYY"),

  statusFormatter: (value: string) => {
    switch (value) {
      case "Новая":
        return `<span style='color:green'>◍</span>&nbsp;&nbsp;${value.replaceAll(" ", "&nbsp;")}`;
      case "В работе":
        return `<span style='color:orange'>◍</span>&nbsp;&nbsp;${value.replaceAll(" ", "&nbsp;")}`;
      case "Завершена":
        return `<span style='color:cyan'>◍</span>&nbsp;&nbsp;${value.replaceAll(" ", "&nbsp;")}`;
      case "Приостановлена":
        return `<span style='color:yellow'>◍</span>&nbsp;&nbsp;${value.replaceAll(" ", "&nbsp;")}`;
        case "Пауза":
        return `<span style='color:yellow'>◍</span>&nbsp;&nbsp;${value.replaceAll(" ", "&nbsp;")}`;
      default:
        return value === null || value === undefined
          ? "-"
          : value?.replaceAll(" ", "&nbsp;");
    }
  },
};

/*
const statusFormatter = (value: string) =>
  `<span style='color:${value === "Новая" ? "green" : "cyan"}'>◍</span>&nbsp;&nbsp;` +
  value.replaceAll(" ", "&nbsp;");

  const dateFormatter = (value: any) => dayjs(value).format("DD.MM.YYYY");
  */
