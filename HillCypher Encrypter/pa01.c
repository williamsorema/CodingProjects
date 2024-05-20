/*=============================================================================
| Assignment: pa01 - Encrypting a pt file using the Vigenere cipher
|
| Author: Williams Orema
| Language: c, c++, Java, go, python
|
| To Compile: javac pa01.java
| gcc -o pa01 pa01.c
| g++ -o pa01 pa01.cpp
| go build pa01.go
|
| To Execute: java -> java pa01 kX.txt pX.txt
| or c++ -> ./pa01 kX.txt pX.txt
| or c -> ./pa01 kx.txt px.txt
| or go -> ./pa01 kX.txt pX.txt
| or python -> python3 pa01.py kX.txt pX.txt
| where kX.txt is the keytext file
| and pX.txt is plaintext file     
|
| Note: All input files are simple 8 bit ASCII input
|
| Class: CIS3360 - Security in Computing - Spring 2023
| Instructor: McAlpin
| Due Date: 03/06/23
|
+=============================================================================*/

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//Matrix Multiply Function
int** matrixMultiply(int ** keyMatrix, int ** temp, int keyMatrixSize, int tempRow) {
  if (keyMatrixSize != tempRow) {
    return NULL;
  } else {
    int ** c = malloc(keyMatrixSize * sizeof(int * ));
    for (int i = 0; i < keyMatrixSize; i++) {
      c[i] = malloc(sizeof(int));
      for (int j = 0; j < 1; j++) {
        c[i][j] = 0;
        for (int k = 0; k < keyMatrixSize; k++) {
          c[i][j] = c[i][j] + (keyMatrix[i][k] * temp[k][j]);
        }
        c[i][j] = c[i][j] % 26;
      }
    }
    return c;
  }
}

int main(int argc, char ** argv) {
  char* fname = argv[1];
  FILE* file = fopen(fname, "r");

  //1 Key Storage
  int matrixNum;
  fscanf(file, "%d", & matrixNum);
  int** keyMatrix = malloc(matrixNum * sizeof(int * ));
  for (int i = 0; i < matrixNum; i++) {
    keyMatrix[i] = malloc(matrixNum * sizeof(int));
  }
  printf("\nKey matrix:");
  for (int i = 0; i < matrixNum; i++) {
    printf("\n");
    for (int j = 0; j < matrixNum; j++) {
      fscanf(file, "%d", & keyMatrix[i][j]);
      if (keyMatrix[i][j] / 100 >= 1) {
        printf(" %d", keyMatrix[i][j]);
      } else if (keyMatrix[i][j] / 10 >= 1) {
        printf("  %d", keyMatrix[i][j]);
      } else {
        printf("   %d", keyMatrix[i][j]);
      }
    }
  }
  fclose(file);

  //2 Plaintext    
  char* fname2 = argv[2];
  FILE* file2 = fopen(fname2, "r");
  char* temp = malloc(10000 * sizeof(char));
  char c;

  while (1) {
    c = fgetc(file2);
    strcat(temp, & c);
    if (feof(file2)) {
      break;
    }
  }

  char* pt = malloc(10000 * sizeof(char));
  int index = 0;
  int charCount;
  for (int i = 0; i < 10000; i++) {
    if (temp[i] >= 97 && temp[i] <= 122) {
      pt[index] = temp[i];
      index++;
    } else if (temp[i] >= 65 && temp[i] <= 90) {
      pt[index] = temp[i];
      pt[index] += 32;
      index++;
    } else if (temp[i] == 0) {
      break;
    }
  }

  charCount = strlen(pt);
  while ((charCount % matrixNum) != 0) {
    pt[index] = 'x';
    index++;
    charCount++;
  }
  
  //printf("\nCharCount: %d \n", charCount);
  //printf("MatrixNum: %d \n", matrixNum);

  printf("\n\nPlaintext:");
  for (int index = 0; index < strlen(pt); index++) {
    //printf("%d ", index);
    if (index % 80 == 0) {
      printf("\n");
    }
    if (pt[index] >= 97 && pt[index] <= 122) {
      printf("%c", pt[index]);
    }
  }

  //3 CypherText & Matrix Multiplication
  printf("\n\nCiphertext: ");
  int** tempMatrix = malloc(matrixNum * sizeof(int*));
  char* cT = malloc(100000 * sizeof(char));
  int iop = 0; // index of plaintext  
  int** ctArr;
  int counter = 0;
  char transfer;
  for (int x = 0; x < matrixNum; x++) {
    tempMatrix[x] = malloc(sizeof(int));
  }
  for (int y = 0; y < (charCount / matrixNum); y++) {
    for (int z = 0; z < matrixNum; z++) {
      tempMatrix[z][0] = pt[iop] - 97;
      // printf("%d ", tempMatrix[z][0]);  to ensure the propper code is submitted
      iop++;
    }

    ctArr = matrixMultiply(keyMatrix, tempMatrix, matrixNum, matrixNum);

    for (int row = 0; row < matrixNum; row++) {
      transfer = ctArr[row][0] + 97;
      strcat(cT, & transfer);
    }
    // printf("\nletter %c", transfer);
  }
  
  for (int index = 0; index < strlen(cT); index++) {
    if (index % 160 == 0) {
      printf("\n");
    }
    if (cT[index] >= 97 && cT[index] <= 122) {
      printf("%c", cT[index]);
    }
    index++;
  }
  printf("\n");
  fclose(file2);


  
  //4  Free
  free(temp);
  free(pt);
  for (int i = 0; i < matrixNum; i++) {
    free(ctArr[i]);
  }
  free(ctArr);
  for (int i = 0; i < matrixNum; i++) {
    free(keyMatrix[i]);
  }
  free(keyMatrix);
  for (int i = 0; i < matrixNum; i++) {
    free(tempMatrix[i]);
  }
  free(tempMatrix);
  free(cT);
  return 0;
}

/*=============================================================================
| I Williams Orema 5224878 affirm that this program is
| entirely my own work and that I have neither developed my code together with
| any another person, nor copied any code from any other person, nor permitted
| my code to be copied or otherwise used by any other person, nor have I
| copied, modified, or otherwise used programs created by others. I acknowledge
| that any violation of the above terms will be treated as academic dishonesty.
+=============================================================================*/