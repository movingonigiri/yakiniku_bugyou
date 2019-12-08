'''
IMPORT MODULES
'''
import keras
from keras.layers import Activation, Conv2D, Dense, Flatten, MaxPooling2D
from keras.models import Sequential
import numpy as np
import matplotlib.pyplot as plt 
import random
import os
import main

SearchName = main.SearchName
ImgSize = main.ImgSize
input_shape = main.input_shape

X_train = []
Y_train = []
X_test = []
Y_test = []
from keras.utils.np_utils import to_categorical
import cv2
import numpy as np
def Test_Teach():
    # 教師データのラベル
    global X_train
    global Y_train
    for i in range(len(SearchName)):
        img_file_name_list = os.listdir('./test_webcam_out/' + SearchName[i])
        print('{}:トレーニング用の写真の数は{}枚です。'.format(SearchName[i], len(img_file_name_list)))

        for j in range(0, len(img_file_name_list)-1):
            n = os.path.join("./test_webcam_out/" + SearchName[i] + "/", img_file_name_list[j])
            img = cv2.imread(n)
            if img is None:
                print('image' + str(j) + ':NoImage')
                continue
            else:
                r,g,b = cv2.split(img)
                img = cv2.merge([r,g,b])
                X_train.append(img)
                Y_train.append(i)
    print("")

    global X_test # 画像の読み込み
    global Y_test # ラベル（名前）
    for i in range(len(SearchName)):
        img_file_name_list = os.listdir("./test/"+SearchName[i])
        print("{}:テスト用の写真の数は{}枚です。".format(SearchName[i], len(img_file_name_list)))
        for j in range(0, len(img_file_name_list)-1):
            n = os.path.join("./test/"+SearchName[i]+"/", img_file_name_list[j])
            img = cv2.imread(n)
            if img is None:
                print('image'+str(j)+':NoImage')
                continue
            else:
                r, g, b = cv2.split(img)
                img = cv2.merge([r,g,b])
                X_test.append(img)
                Y_test.append(i)

    X_train = np.array(X_train)
    X_test = np.array(X_test)
    Y_train = to_categorical(Y_train)
    Y_test = to_categorical(Y_test)

    return X_test


def Predict(X_test, model):
    index = random.randint(0, len(X_test)-1)
    print("index:", index)

    ret = model.predict(X_test[index:(index+1)], batch_size=1)   # OK
    print("predict ret:", ret)

    np.set_printoptions(precision=5, suppress=True) #指数表示の禁止

    bestnum = 0.0
    bestclass = 0
    for n in range(0, len(SearchName)):
        if bestnum < ret[0][n]:
            bestnum = ret[0][n]
            bestclass = n

    plt.title(SearchName[bestclass])
    plt.imshow(X_test[index])
    plt.show()

if __name__ == '__main__':
    model = keras.models.load_model('./MyModel.h5', compile=False)
    X_test = Test_Teach()
    Predict(X_test, model)