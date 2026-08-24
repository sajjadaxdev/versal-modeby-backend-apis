import * as languageRepository from "../repositories/languageRepository.js";
import { AppError } from "../utils/AppError.js";

/*
|--------------------------------------------------------------------------
| Get All Languages
|--------------------------------------------------------------------------
*/
export const getLanguages = async () => {
  const languages = await languageRepository.findAll();

  return {
    success: true,
    message: "Languages fetched successfully",
    data: languages,
  };
};

/*
|--------------------------------------------------------------------------
| Get Translations by Lang Code
|--------------------------------------------------------------------------
*/
export const getTranslations = async (langCode) => {
  if (!langCode) {
    throw new AppError("Language code is required.", 400);
  }

  const language = await languageRepository.findByCode(langCode);

  if (!language) {
    throw new AppError("Language not found.", 404);
  }

  const rows = await languageRepository.findTranslations(langCode);

  // Array to object — { key: value }
  const translations = rows.reduce((acc, row) => {
    acc[row.key_name] = row.value;
    return acc;
  }, {});

  return {
    success: true,
    lang: langCode,
    direction: language.direction,
    translations,
  };
};