from fastapi import APIRouter

from sumy.parsers.html import HtmlParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

router = APIRouter()


@router.get("/api/summarize")
async def summarize(url: str, sentence_count: int):
    parser = HtmlParser.from_url(url, Tokenizer("english"))
    stemmer = Stemmer("english")

    summarizer = Summarizer(stemmer)
    summarizer.stop_words = get_stop_words(language="english")

    sentences = summarizer(parser.document, sentence_count)
    sentences = [str(sentence) for sentence in sentences]

    return " ".join(sentences)