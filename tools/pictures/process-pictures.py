import sys, getopt, os, shutil


def main(argv):
    inputdir = ""
    outputdir = ""

    try:
        opts, args = getopt.getopt(argv, "hi:o:", ["idir=", "odir="])
    except getopt.GetoptError:
        print("process-pictures.py -i <inputdir> -o <outputdir>")
        sys.exit(2)
    
    for opt, arg in opts:
        if opt == '-h':
            print("process-pictures.py -i <inputdir> -o <outputdir>")
            sys.exit()
        elif opt in ("-i", "--idir"):
            inputdir = arg
        elif opt in ("-o", "--odir"):
            outputdir = arg

    if inputdir == "" or outputdir == "":
        print("Missing options!")
        sys.exit(2)

    number = 0

    for file in os.listdir(inputdir):
        shutil.copyfile("%s/%s" % (inputdir, file), "%s/%i.jpg" % (outputdir, number))
        number += 1

    print("Processed %i files" % number)

if __name__ == "__main__":
    main(sys.argv[1:])
