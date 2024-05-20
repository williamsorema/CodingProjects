/*=============================================================================
| Assignment: pa02 - Calculating an 8, 16, or 32 bit
| checksum on an ASCII input file
|
| Author: Williams Orema
| Language: c, c++, Java, GO, Python
|
| To Compile: javac pa02.java
| gcc -o pa02 pa02.c
| g++ -o pa02 pa02.cpp
| go build pa02.go
| python pa02.py //Caution - expecting input parameters
|
| To Execute: java -> java pa02 inputFile.txt 8
| or c++ -> ./pa02 inputFile.txt 8
| or c -> ./pa02 inputFile.txt 8
| or go -> ./pa02 inputFile.txt 8
| or python-> python pa02.py inputFile.txt 8
| where inputFile.txt is an ASCII input file
| and the number 8 could also be 16 or 32
| which are the valid checksum sizes, all
| other values are rejected with an error message
| and program termination
|
| Note: All input files are simple 8 bit ASCII input
|
| Class: CIS3360 - Security in Computing - Spring 2023
| Instructor: McAlpin
| Due Date: per assignment
|
+=============================================================================*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

void getInputFileCheckSum(char *filename, int size);

void getCheckSum(int size, char *inputString, unsigned int long *check);

unsigned int long getBitMask(char *inputString, int checkSumSize);

int main(int argc, char **argv) {
  int index = 0;
  int bSize = 0;

  printf("\n");
  // stores text input
  char *fname = argv[1];
  FILE *file = fopen(fname, "r");

  char *temp = malloc(10000 * sizeof(char));
  char *input = malloc(10000 * sizeof(char));
  char c;
  int cCount = 0;

  while (1) {
    if (feof(file))
      break;
    c = fgetc(file);
    strcat(temp, &c);
  }

  for (int x = 0; x < 10000; x++) {
    if (temp[x] >= 65 && temp[x] <= 122) {
      input[index] = temp[x];
      index++;
      cCount++;
    } else if (temp[x] == 0) {
      break;
    }
  }

  /*Checker: 
      printf("Input: %s\n", input);
      printf("Character Count: %d\n", cCount);
  */

  free(temp);
  free(input);
  fclose(file);

  // stores bSize
  char *fname2 = argv[2];
  bSize = atoi(fname2);
  if(bSize != 8 && bSize != 16 && bSize != 32){
    fprintf(stderr, "Valid checksum sizes are 8, 16, or 32\n");
  }
  getInputFileCheckSum(fname, bSize);
}

void getInputFileCheckSum(char *filename, int size){
  FILE *input;
  
  int cValue = 0;
  int cCount = 0;

  int wordSize = (size / 8) + 1;

  unsigned int long *checksum = calloc(1, sizeof(unsigned int long));

  char *charInput = malloc(wordSize * sizeof(char));

  int a = 0;
  int b = 0;
  int c = 0;

  input = fopen(filename, "r");

  if(input == NULL){
    printf("Unable to open file!\n");
    return;
  }
  
  while(cValue != EOF){
    if(wordSize - a == 1){
      charInput[a] = '\0';

      printf("%s", charInput);

      getCheckSum(size, charInput, checksum);

      b++;

      a = 0;

      if(b * (wordSize - 1) == 80)
        printf("\n");
    }else{
      cValue = fgetc(input);

      if(cValue == EOF){
        
        if(size == 16 || size == 32){
          
          if((wordSize - a) != 1 && (wordSize - a) != wordSize){
            c = 0;

            while((wordSize - a) != 1 && (wordSize - a) != wordSize){
              charInput[a] = 'X';
              a++;
              c++;
            }

            charInput[a] = '\0';
            printf("%s", charInput);

            getCheckSum(size, charInput, checksum);

            b++;

            cCount += c -1;

            a = 0;

            if(b * (wordSize - 1) == 80)
              printf("\n");
          }else{
            break;
          }
        }else{
          break;
        }
      }else{
        charInput[a] = cValue;
      }
      
      cCount++;
      a++;
        
    }
  }

  fclose(input);
  printf("\n");
  printf("%2d bit checksum is %8lx for all %4d chars\n", size, *checksum, cCount);
  free(checksum);
  free(charInput);
}

void getCheckSum(int size, char *inputString, unsigned int long *checksum){
  unsigned int long maskbit;

  maskbit = getBitMask(inputString, size);

  *checksum = maskbit + *checksum;
  *checksum = *checksum << (64 - size);
  *checksum = *checksum >> (64 - size);
}

unsigned int long getBitMask(char *inputString, int size){
  int i = 0;

  unsigned int long maskedBits;

  maskedBits = inputString[i];

  size -= 8;

  while(size != 0){
    maskedBits = (maskedBits << 8) + inputString[i + 1];
    size -= 8;
    i++;
  }

  return maskedBits;
}

/*=============================================================================
| I [Williams Orema] ([wi916040]) affirm that this program is
| entirely my own work and that I have neither developed my code together with
| any another person, nor copied any code from any other person, nor permitted
| my code to be copied or otherwise used by any other person, nor have I
| copied, modified, or otherwise used programs created by others. I acknowledge
| that any violation of the above terms will be treated as academic dishonesty.
+============================================================================*/