#!/usr/bin/env bash

cat ../public/assets/books/*.yml \
  | fold -w1 \
  | sort -u \
  > all-chars.txt

awk 'NR==26 {
  while ((getline line < "all-chars.txt") > 0) {
    print line
  }
}
{ print }' template.html > temp.html

font-spider temp.html

rm all-chars.txt
# rm font.ttf
rm temp.html

mv font.woff ../src/css
