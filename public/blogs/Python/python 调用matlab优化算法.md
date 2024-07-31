# 摘要

以以606项目的热分析稳态仿真流程优化为例，对实现思路和源码进行说明：实现主要思路：

在热分析稳态的python业务代码中采用matlab引擎的方式调用编写好的m脚本函数selfStudyMATLAB_OPT_CallPy，在selfStudyMATLAB_OPT_CallPy中调用编写好的python评价函数JNZThermal_Steady_OPT_SelfStudy_Thread脚本，采用这样的方式主要是因为采用python实现结果的后处理更方便。





# 实现demo

MATLAB语言编写的 selfStudyMATLAB_OPT_CallPy源码：

```matlab
function outputDict = selfStudyMATLAB_OPT_CallPy(algorithmType, filePath, projectCreat_Id, list_paras, output_para_list,...
    objectPara, objectDirection, objectValue, low_paras,high_paras, optionsAlgorithm, OPT_Process)

% 优化的评价函数不能传递其他多余的参数
% 需要定义全局变量，因为有些变量会在下面的评价函数中使用。
global pyObj;
global projectCreat_Id;
global OPT_Process;

%优化算法参数配置
A=[];
b = [];
Aeq = [];
beq = [];
max_iter = optionsAlgorithm.max_Iter;
low_paras = cell2mat(low_paras);
high_paras = cell2mat(high_paras);
nvars = length(list_paras);

% 评价函数
fun = @asessFunction;

% 下面的程序段是直接调用python脚本写的仿真流程集成类，
% 也可以直接采用matlab脚本编写仿真流程集成的脚本，
% 这样就可以采用matlab实时运行环境导入python库的方式来进行，这样的方式更灵活。
if strcmp(OPT_Process, 'thermalTrans')
    % 重新加载Python模块
    mod = py.importlib.import_module('JNZThermal_Trans_OPT_SelfStudy_Thread');
    py.importlib.reload(mod);
    %进行评价函数类的初始化
    pyObj = py.JNZThermal_Trans_OPT_SelfStudy_Thread.JNZFresh_Result_Opt_SubThread_SelfStudy_Thermal_Trans(filePath,projectCreat_Id, list_paras, output_para_list, objectPara, objectDirection, objectValue);
elseif strcmp(OPT_Process, 'thermalSteady')
    mod = py.importlib.import_module('JNZThermal_Steady_OPT_SelfStudy_Thread_Test');
    py.importlib.reload(mod);
    %进行评价函数类的初始化
    pyObj = py.JNZThermal_Steady_OPT_SelfStudy_Thread_Test.JNZFresh_Result_Opt_SubThread_SelfStudy_Thermal_Steady(filePath,projectCreat_Id, list_paras, output_para_list, objectPara, objectDirection, objectValue);
else
    mod = py.importlib.import_module('JNZAirsys_OPT_SelfStudy_Thread');
    py.importlib.reload(mod);
    pyObj = py.JNZAirsys_OPT_SelfStudy_Thread.JNZFresh_Result_Opt_SubThread_SelfStudy_Airsys(filePath,projectCreat_Id, list_paras, output_para_list, objectPara, objectDirection, objectValue);
end

% 根据算法类型参数，调用不同的全局优化算法
if strcmp(algorithmType, 'MATLAB_GA')
    size_pop = optionsAlgorithm.pop_Num;
    options = optimoptions('ga', "PopulationSize",size_pop, 'MaxGenerations', max_iter);
    [x,fval] = ga(fun,nvars,A,b,Aeq,beq,low_paras,high_paras,[], options);
elseif strcmp(algorithmType, 'MATLAB_PSO')
    size_pop = optionsAlgorithm.pop_Num;
    options = optimoptions('particleswarm','SwarmSize',size_pop,"MaxIterations",max_iter);
    [x,fval,~,~] = particleswarm(fun,nvars,low_paras,high_paras,options);
elseif strcmp(algorithmType, 'MATLAB_fmincon')
    global_OPT_point = cell2mat(optionsAlgorithm.global_OPT_point);
    localOPTAlgorithm = optionsAlgorithm.localOPTAlgorithm;
    options = optimoptions('fmincon','Algorithm',localOPTAlgorithm,  "MaxIterations",max_iter, "FiniteDifferenceType","central");
    x0 = global_OPT_point;
    nonlcon = [];
    [x,fval] = fmincon(fun,x0,A,b,Aeq,beq,low_paras,high_paras,nonlcon,options);
end

%将结果写成结构体，在python中对应的数据类型是结构体
outputDict.bestX = x;
outputDict.bestY = fval;
end


function y = asessFunction(x)
global pyObj;
global projectCreat_Id;
global OPT_Process;

% 由于算法本身没有暂停的接口，采用读取停止标志符文件的方式，实现优化迭代停止功能
f = projectCreat_Id;
sourceFile = [f, '\datas\OPT\stopFlag.txt'];
destinationFile = [f, '\datas\OPT\stopFlagCopy.txt'];
status = copyfile(sourceFile, destinationFile, 'f');

filename = destinationFile;
fid = fopen(filename);
data = textscan(fid,'%s');
fclose(fid);
a=cell2mat(data{1,1});
a = strsplit(a, '=');
stopFlag = a{1,2};

% 只有是未暂停的标志符，才会真真执行评价函数，否则matlab会出现运行错误而停止，
% 故需要在调用该程序的python脚本做好异常程序捕捉
if strcmp(stopFlag, '0')
    if strcmp(OPT_Process, 'thermalTrans')
        y = pyObj.selfStudy_project_Thermal_Trans(x);
        
    elseif strcmp(OPT_Process, 'thermalSteady')
        y = pyObj.selfStudy_project_Thermal_Steady(x);
    else
        y = pyObj.selfStudy_project_Airsys(x);
    end
end
end


```

该程序段是评价函数JNZThermal_Steady_OPT_SelfStudy_Thread的源码和说明：



```python
1.	import sys 
2.	# 将仿真流程所依赖的模块手动添加到库搜索路径当中  
3.	# 不然在matlab中调用python脚本时会找不到某些依赖模块，如WriteToConf_Thermal、resultCompare_Thermal  
4.	sys.path.append('./venv/Lib/site-packages')  
5.	import WriteToConf_Thermal  
6.	import resultCompare_Thermal  
7.	import os  
8.	import pandas as pd  
9.	import shutil  
10.	import subprocess  
11.	  
12.	class JNZFresh_Result_Opt_SubThread_SelfStudy_Thermal_Steady:  
13.	    """ 
14.	    实现MATALB优化算法和热分析稳态自研流程中需要用的评价函数 
15.	    """  
16.	  
17.	    def __init__(self, filePath, projectCreat_Id, list_paras, output_para_list,  objectPara, objectDirection, objectValue):  
18.	        # 变量的初始化  
19.	        self.filePath = filePath  
20.	        self.projectCreat_Id = projectCreat_Id  
21.	        self.list_paras = list_paras  
22.	        self.output_para_list = output_para_list  
23.	        self.dim_x = len(self.list_paras)  
24.	        self.objectPara = objectPara  
25.	        self.objectDirection = objectDirection  
26.	        self.objectValue = float(objectValue)  
27.	        self.iterNum = 1  
28.	  
29.	    # 仿真流程评价函数  
30.	    def selfStudy_project_Thermal_Steady(self, p):  
31.	        # 算法中的输入参数写入inputPara.txt，并更新到conf文件  
32.	        self.list_values = p #[p,100]  
33.	        self.write_para_to_file()  
34.	        self.filePath_Conf = os.path.join(self.filePath, r'Thermal_conf.conf')  
35.	        self.filePath_para = os.path.join(self.filePath, r'inputPara.txt')  
36.	        WriteToConf_Thermal.writeToConf(self.filePath_Conf, self.filePath_para)  
37.	        self.new_filePath_Conf = os.path.join(self.filePath, r'origin.conf')  
38.	        shutil.copyfile(self.filePath_Conf, self.new_filePath_Conf)  
39.	  
40.	        # 准备HTC的bat文件  
41.	        self.command_HTC = os.path.join(self.filePath, 'cmd_perl.bat')  
42.	        self.generate_BatFile(self.filePath, self.command_HTC)  
43.	  
44.	        # HTC的bat文件调用  
45.	        b2 = subprocess.Popen(self.command_HTC, shell=True)  
46.	        b2.wait()  
47.	  
48.	        # 准备ansys的bat文件  
49.	        self.command_ANSYS = os.path.join(self.filePath, 'cmd_ansys.bat')  
50.	        self.generate_BatFile(self.filePath, self.command_ANSYS)  
51.	  
52.	        # ansys的bat文件调用  
53.	        b2 = subprocess.Popen(self.command_ANSYS, shell=True)  
54.	        b2.wait()  
55.	  
56.	# ----------------------------------------------------------------结果后处理-- 开始  
57.	        #仿真结果后处理，获得TEMP_ERROR.TXT  
58.	        resultCompare_Thermal.cal_Error(self.filePath)  
59.	        # 生成中间文件,方便提出输出参数值  
60.	        self.output_value_dict = self.generateMidFile()  
61.	        self.midFile_Path = os.path.join(self.filePath, 'midFile.txt')  
62.	        self.df_mid_paras = pd.read_csv(self.midFile_Path, encoding='ANSI', sep='\s+')  
63.	        for i in range(len(self.df_mid_paras)):  
64.	            if self.df_mid_paras.iloc[i][1].startswith('num'):  
65.	                break  
66.	            else:  
67.	                self.output_value_dict.update({'num%s' % (i + 1): self.df_mid_paras.iloc[i][2]})  
68.	                self.output_value_dict.update({'absE%s' % (i + 1): self.df_mid_paras.iloc[i][3]})  
69.	                self.output_value_dict.update({'relE%s' % (i + 1): self.df_mid_paras.iloc[i][4]})  
70.	  
71.	        # 输出参数信息列表  
72.	        self.output_value_list = []  
73.	        for i, element in enumerate(self.output_para_list):  
74.	            self.output_value_list.append(self.output_value_dict[element])  
75.	        self.output_dic = dict(zip(self.output_para_list, self.output_value_list))  
76.	        self.df_output = pd.DataFrame(columns=self.output_para_list)  
77.	        self.df_output = self.df_output.append([self.output_dic], ignore_index=True)  
78.	        self.input_dic = dict(zip(self.list_paras, self.list_values))  
79.	        self.data_dic = {}  
80.	        self.data_dic.update(self.input_dic)  
81.	        self.data_dic.update(self.output_dic)  
82.	# ----------------------------------------------------------------结果后处理-- 结束  
83.	  
84.	  
85.	# ----------------------------------------------------------------将计算结果实时写入文件中，用于界面展示-- 开始  
86.	        result_Opt_NewPath_SelfStudy = os.path.join(self.projectCreat_Id, 'IsightMethod',  
87.	                                                    'Result_forIsightProject_Opt.txt')  
88.	        self.writeOPT_processFilePath(result_Opt_NewPath_SelfStudy, self.input_dic, self.output_dic)  
89.	# ----------------------------------------------------------------将计算结果实时写入文件中，用于界面展示-- 结束  
90.	  
91.	        object_Result = float(self.output_dic[self.objectPara]) - self.objectValue  
92.	        if(self.objectDirection == 'maximize'):  
93.	            return 0 - object_Result  
94.	        # 返回计算结果，用于matlab优化算法进行下一次的优化  
95.	        return object_Result  
96.	  
97.	    # 生成中间文件，便于提取输出参数  
98.	    def generateMidFile(self):  
99.	        output_value_dict1 = {}  
100.	        filePath_Error = os.path.join(self.filePath, r'TEMP_ERROR.TXT')  
101.	        df_Cavity = pd.read_csv(filePath_Error, encoding='ANSI', header=None)  
102.	        dataValue = df_Cavity.values  
103.	        index = 0  
104.	        for i, item in enumerate(dataValue):  
105.	            if dataValue[i][0].startswith('Details:'):  
106.	                index = i + 1  
107.	                break  
108.	            else:  
109.	                content = dataValue[i][0].split('=')  
110.	                output_value_dict1.update({content[0].strip(): content[1].strip()})  
111.	  
112.	        print(index)  
113.	  
114.	        row = len(dataValue)  
115.	  
116.	        self.midFile_Path = os.path.join(self.filePath, 'midFile.txt')  
117.	        f = open(self.midFile_Path, "wb")  
118.	        for i in range(index, row):  
119.	            f.write(bytes(dataValue[i][0], encoding="ANSI"))  
120.	            f.write(bytes('\n', encoding="ANSI"))  
121.	        f.close  
122.	        return output_value_dict1  
123.	  
124.	    # 生成bat文件  
125.	    def generate_BatFile(self, filePath, filePath_Bat):  
126.	        try:  
127.	            # 通过这个，使bat  
128.	            if self.iterNum <=1:  
129.	                text = "cd /D "  
130.	                text += filePath  
131.	                text += '\n'  
132.	                with open(filePath_Bat, 'r') as f1:  
133.	                    content1 = f1.readlines()  
134.	                with open(filePath_Bat, 'w') as f:  
135.	                    f.write(text + ''.join(content1))  
136.	        except Exception as error:  
137.	            print('执行generate_BatFile函数错误', str(error))  
138.	  
139.	    # 输入参数写入输入文件  
140.	    def write_para_to_file(self):  
141.	        self.inputPara_FilePath = os.path.join(self.filePath, 'inputPara.txt')  
142.	        data = pd.read_csv(self.inputPara_FilePath, header=None, encoding='ANSI', sep='\s+')  
143.	        dataValue = data.values  
144.	        row = len(dataValue)  
145.	        for i in range(row):  
146.	            for j, item in enumerate(self.list_paras):  
147.	                if dataValue[i][0].strip() == item.strip():  
148.	                    dataValue[i][1] = str(self.list_values[j])  
149.	  
150.	        f = open(self.inputPara_FilePath, "wb")  
151.	        for i in range(row):  
152.	            f.write(  
153.	                bytes('%10s\t%20s\t%50s' % (dataValue[i][0], dataValue[i][1], dataValue[i][2]), encoding="ANSI"))  
154.	            f.write(bytes('\n', encoding="ANSI"))  
155.	        f.close  
156.	        return  
157.	  
158.	    # 将优化结果写入文本  
159.	    def writeOPT_processFilePath(self, filePath, inputVarsValues, outputVarsValues):  
160.	        try:  
161.	            with open(filePath, 'a', encoding='ANSI') as f1:  
162.	                middleTextTitle = str(self.iterNum) + '\t\t'  
163.	                for key, element in inputVarsValues.items():  
164.	                    middleTextTitle = middleTextTitle + str(element) + '\t\t'  
165.	                for key, element in outputVarsValues.items():  
166.	                    middleTextTitle = middleTextTitle + str(element) + '\t\t'  
167.	                f1.write(middleTextTitle + '\n')  
168.	                self.iterNum = self.iterNum + 1  
169.	        except Exception as errorText:  
170.	            print('写入过程文件错误', str(errorText))  
171.	  
172.	if __name__ == '__main__':  
173.	    pass

```





