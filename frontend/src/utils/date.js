const pad2 = (value) => String(value).padStart(2, "0");

const parseDateInput = (value) => {
   if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value;
   }
   if (typeof value === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
         const parsed = new Date(`${value}T00:00:00`);
         if (!Number.isNaN(parsed.getTime())) {
            return parsed;
         }
      }
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
         return parsed;
      }
   }
   return null;
};

export const getLocalDateString = (value = new Date()) => {
   const date = parseDateInput(value) || new Date();
   return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

export const getLocalDateRange = (value = new Date()) => {
   const date = parseDateInput(value) || new Date();
   const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
   const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0);
   return {
      startUtc: start.toISOString(),
      endUtc: end.toISOString(),
   };
};

export const formatLocalDateMd = (value) => {
   const date = parseDateInput(value);
   if (!date) {
      return "";
   }
   return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

export const formatLocalDateYmd = (value) => {
   const date = parseDateInput(value);
   if (!date) {
      return "";
   }
   return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};
