import { read, utils } from "https://cdn.sheetjs.com/xlsx-latest/package/xlsx.mjs";

export const requestSubwaySheet = async () => {
    try {
        const res = await fetch("./resource/실시간도착_역정보(20231215).xlsx");
        if (!res.ok) {
            throw new Error(`xlsx file 요청 실패 ${e.message}`);
        }
        const buffer = await res.arrayBuffer();
        const workbook = read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const parse = utils.sheet_to_row_object_array(sheet)
        parse;

        return parse;
    } catch (e) {
        throw new Error(e);
    }
};

