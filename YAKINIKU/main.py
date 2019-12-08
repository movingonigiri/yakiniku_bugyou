import shutil
import random
import glob
import os
import numpy as np
import cv2
from keras.layers import Activation, Conv2D, Dense, Flatten, MaxPooling2D, SimpleRNN, SeparableConv2D, GaussianNoise, add
from keras.models import Sequential
from keras.utils.np_utils import to_categorical
import matplotlib.pyplot as plt
from keras.utils.vis_utils import plot_model as plot
from keras.layers.merge import concatenate
from keras.models import Model

from PIL import Image

# from keras import backend as K
# K.set_learning_phase(1) #set learning phase

# なぜか使えない問題↓
# import tensorflowjs as tfjs
# import tensorflow as tf

SearchName = ["牛タン","ハラミ","カルビ","ロース"]
ImgSize=(500, 500)
input_shape=(500, 500, 3)

def Classification():
    for name in SearchName:
        in_dir = './learn/' + name + '/*'
        in_jpg = glob.glob(in_dir)
        # img_file_name_listをシャッフル。そのうち２割をtest_imageディレクトリに入れる
        random.shuffle(in_jpg)
        os.makedirs('./test/' + name, exist_ok = True)
        for t in range(len(in_jpg)//5):
            shutil.move(str(in_jpg[t]), "./test/"+name)

def Test_Teach():
    # 教師データのラベル付け
    X_train = [] 
    Y_train = [] 
    for i in range(len(SearchName)):
        img_file_name_list=os.listdir("./learn/"+SearchName[i]+'/')
        print("{}:トレーニング用の写真の数は{}枚です。".format(SearchName[i],len(img_file_name_list)))

        for j in range(0,len(img_file_name_list)-1):
            n=os.path.join("./learn/"+SearchName[i]+"/",img_file_name_list[j]) 
            print(n)
            print(i)
            try:                    
                # img = cv2.imread(n)
                img = Image.open(n).convert("RGB")
                img = img.resize((500, 500))
                img = np.array(img)
                print(img)
                X_train.append(img)
                Y_train.append(i)
            except:
                print('ファイルを開くのに失敗しました')
    print("")

    # テストデータのラベル付け
    X_test = [] # 画像データ読み込み
    Y_test = [] # ラベル（名前）
    for i in range(len(SearchName)):
        img_file_name_list=os.listdir("./test/"+SearchName[i])
        print("{}:テスト用の写真の数は{}枚です。".format(SearchName[i],len(img_file_name_list)))
        for j in range(0,len(img_file_name_list)-1):
            n=os.path.join("./test/"+SearchName[i]+"/",img_file_name_list[j]) 
            print(n)
            print(i)
            try:                    
                # img = cv2.imread(n)
                img = Image.open(n).convert("RGB")
                img = img.resize((500, 500))
                img = np.array(img)
                print(img)
                X_test.append(img)
                Y_test.append(i)
            except:
                print('ファイルを開くのに失敗しました')
    print("")
    X_train= np.array(X_train)
    X_test= np.array(X_test)
    y_train = to_categorical(Y_train)
    y_test = to_categorical(Y_test)

    # モデルの定義        # モデルの定義
    model = Sequential()
    model.add(Conv2D(input_shape=input_shape, filters=32,kernel_size=(3, 3), strides=(1, 1), padding="same"))
    # model.add(SeparableConv2D(filters=64, kernel_size=(3, 3), strides=(1, 1), padding='valid', data_format=None, depth_multiplier=3, activation=None))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(GaussianNoise(0.1))
    # model.add(Activation('relu'))
    model.add(Conv2D(filters=64, kernel_size=(3, 3), strides=(1, 1), padding="same"))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Activation('tanh'))
    model.add(Conv2D(filters=128, kernel_size=(3, 3), strides=(1, 1), padding="same"))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Flatten())
    model.add(Dense(256))
    model.add(Activation("sigmoid"))
    model.add(Dense(128))
    model.add(Activation('sigmoid'))
    # 分類したい人数を入れる
    model.add(Dense(len(SearchName)))
    model.add(Activation('softmax'))        

    # モデルのサマリを表示
    model.summary()

    # コンパイル
    model.compile(optimizer='sgd', loss='categorical_crossentropy', metrics=['accuracy'])
    
    # 学習
    history = model.fit(X_train, y_train, batch_size=25, epochs=500, verbose=1, validation_data=(X_test, y_test))

    acc = history.history["accuracy"]
    val_acc = history.history["val_accuracy"]
    loss = history.history["loss"]
    val_loss = history.history["val_loss"]
    epochs = range(1, len(acc)+1)
    
    #モデルを保存
    model.save("./model.h5")

    #acc, val_accのプロット
    plt.plot(acc, label="accuracy", ls="-", marker="o")
    plt.plot(val_acc, label="val_accuracy", ls="-", marker="x")
    plt.ylabel("accuracy")
    plt.xlabel("epoch")
    plt.legend(loc="best")
    plt.savefig("./accuracy.png")
    plt.clf()

    #acc, val_accのプロット
    plt.plot(loss, label="loss", ls="-", marker="o")
    plt.plot(val_loss, label="val_loss", ls="-", marker="x")
    plt.ylabel("loss")
    plt.xlabel("epoch")
    plt.legend(loc="best")
    plt.savefig("./loss.png")
    plt.clf()
    
    # tfjs.converters.save_keras_model(model, './model.h5')


if __name__ == '__main__':
    Classification()
    Test_Teach()