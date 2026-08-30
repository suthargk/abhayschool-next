export function getColumns(t) {
  return [
    { key: "status", label: t("columns.status"), defaultVisible: true },
    { key: "author", label: t("columns.author"), defaultVisible: true },
    { key: "created", label: t("columns.created"), defaultVisible: true },
  ];
}
