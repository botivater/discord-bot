import sys, getopt
import json


def main(argv):
    inputfile = ""
    outputfile = ""

    try:
        opts, args = getopt.getopt(argv, "hi:o:", ["ifile=", "ofile="])
    except getopt.GetoptError:
        print("transform-list.py -i <inputfile> -o <outputfile>")
        sys.exit(2)
    
    for opt, arg in opts:
        if opt == '-h':
            print("transform-list.py -i <inputfile> -o <outputfile>")
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfile = arg
        elif opt in ("-o", "--ofile"):
            outputfile = arg

    if inputfile == "" or outputfile == "":
        print("Missing options!")
        sys.exit(2)

    tips_list = list()

    with open(inputfile, 'r') as tips:
        for tip in tips:
            tip = tip.strip()

            if tip == "":
                continue

            tips_list.append(tip)

    print("Processed %i lines!" % len(tips_list))
    print("Converting to JSON now...")

    with open(outputfile, 'w') as outfile:
        json.dump(tips_list, outfile)

    print("Done!")

if __name__ == "__main__":
    main(sys.argv[1:])
