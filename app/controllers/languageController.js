import * as languageService from "../services/languageService.js";

/*
|--------------------------------------------------------------------------
| Get All Languages
|--------------------------------------------------------------------------
*/
export const index = async (req, res, next) => {
  try {
    
    const result = await languageService.getLanguages();
    return res.json(result);

  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Translations
|--------------------------------------------------------------------------
*/
export const translations = async (req, res, next) => {
  try {
    const result = await languageService.getTranslations(req.query.lang);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};